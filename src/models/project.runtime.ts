/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast, AlertStatus } from '@chakra-ui/react'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import type { StoreModel } from './index'
import type {
  ProcessPayload,
  CommitLog,
  StatusPayloadWithRuntime,
  PayloadError,
  HistoryReply,
  BoolReply,
} from '../backend/backend.interface'
import { Broadcast, Handler, ProjectStatus } from '../backend/backend.interface'
import { ProjectViewWithRuntime, ProjectWithRuntime, BackgroundImage, Colors } from './project.interface'
import { MainIpcChannel, ImportPayloadWithRuntime } from '../interface'
import storeProject from '../services/storeProject'
import { CssUrlReg } from '../utils/assest'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendBackIpc, listenBackIpc, unlistenBackIpc, listenMainIpc, unlistenMainIpc, sendMainIpc, sendMainIpcSync } =
  window.derealize

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

const judgeFrontView = (project?: ProjectWithRuntime) => {
  if (!project) {
    sendMainIpc(MainIpcChannel.FrontView)
    return
  }
  if (!project.isFront) return
  if (project.view === ProjectViewWithRuntime.BrowserView) {
    if (!project.config) throw new Error('project.config null')
    sendMainIpc(
      MainIpcChannel.FrontView,
      project.id,
      project.config.baseUrl,
      [...project.config.pages],
      project.config.isWeapp,
    )
  } else {
    sendMainIpc(MainIpcChannel.FrontView)
  }
}

export interface ProjectWithRuntimeModel {
  projects: Array<ProjectWithRuntime>
  setProjects: Action<ProjectWithRuntimeModel, Array<ProjectWithRuntime>>

  editingProject: Computed<ProjectWithRuntimeModel, ProjectWithRuntime | undefined>
  setEditingProject: Action<ProjectWithRuntimeModel, string | null>
  editProject: Action<ProjectWithRuntimeModel, { displayname: string; branch: string }>

  openedProjects: Computed<ProjectWithRuntimeModel, Array<ProjectWithRuntime>>
  frontProject: Computed<ProjectWithRuntimeModel, ProjectWithRuntime | undefined>
  isReady: Computed<ProjectWithRuntimeModel, (id: string) => boolean | undefined>

  addProject: Action<ProjectWithRuntimeModel, ProjectWithRuntime>
  removeProject: Action<ProjectWithRuntimeModel, string>
  removeProjectThunk: Thunk<ProjectWithRuntimeModel, string>

  setProjectView: Action<ProjectWithRuntimeModel, { projectId: string; view: ProjectViewWithRuntime }>
  setProjectViewHistory: Action<ProjectWithRuntimeModel, { projectId: string; isView: boolean }>
  setTailwindConfig: Action<ProjectWithRuntimeModel, { projectId: string; config: TailwindConfig }>

  pushRunningOutput: Action<ProjectWithRuntimeModel, { projectId: string; output: string }>
  emptyRunningOutput: Action<ProjectWithRuntimeModel, string>
  setStartLoading: Action<ProjectWithRuntimeModel, { projectId: string; loading: boolean }>

  flushProject: Action<ProjectWithRuntimeModel, string>
  setFrontProject: Action<ProjectWithRuntimeModel, string | null>
  startProject: Thunk<ProjectWithRuntimeModel, string>
  stopProject: Action<ProjectWithRuntimeModel, string>

  openProject: Thunk<ProjectWithRuntimeModel, string>
  closeProject: Action<ProjectWithRuntimeModel, string>
  closeProjectThunk: Thunk<ProjectWithRuntimeModel, string | undefined>

  setProjectStatus: Action<ProjectWithRuntimeModel, StatusPayloadWithRuntime>
  loadStore: Thunk<ProjectWithRuntimeModel>
  listen: Thunk<ProjectWithRuntimeModel, void, void, StoreModel>
  unlisten: Action<ProjectWithRuntimeModel>

  importModalDisclosure: boolean
  toggleImportModal: Action<ProjectWithRuntimeModel, boolean | undefined>

  imagesModalDisclosure: boolean
  toggleImagesModal: Action<ProjectWithRuntimeModel, boolean | undefined>
  modalImages: Computed<ProjectWithRuntimeModel, BackgroundImage[]>

  colorsModalShow: boolean
  colorsModalData: { colors: Colors; theme: string } | undefined
  colorsModalToggle: Action<ProjectWithRuntimeModel, { show: boolean; colors?: Colors; theme?: string }>

  gitHistorys: Array<CommitLog>
  setGitHistorys: Action<ProjectWithRuntimeModel, Array<CommitLog>>
  callGitHistory: Thunk<ProjectWithRuntimeModel>

  setJitClassName: Action<ProjectWithRuntimeModel, { projectId: string; className: string }>
}

const projectModel: ProjectWithRuntimeModel = {
  projects: [],
  setProjects: action((state, projects) => {
    state.projects = [...projects]
    storeProject(state.projects)
  }),

  editingProject: computed((state) => {
    return state.projects.find((p) => p.isEditing)
  }),
  setEditingProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isEditing = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isEditing = true
      judgeFrontView(undefined)
    } else {
      judgeFrontView(state.frontProject)
    }
  }),
  editProject: action((state, { displayname, branch }) => {
    const project = state.projects.find((p) => p.isEditing)
    if (!project) return

    project.name = displayname
    project.branch = branch
    storeProject(state.projects)
  }),

  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  frontProject: computed((state) => {
    return state.projects.find((p) => p.isFront)
  }),
  isReady: computed((state) => (id) => {
    return state.projects.find((p) => p.id === id)?.status === ProjectStatus.Ready
  }),

  addProject: action((state, project) => {
    if (state.projects.some((p) => p.id === project.id)) {
      throw Error('projectId already exist.')
    }

    state.projects.push(project)
    storeProject(state.projects)
  }),
  removeProject: action((state, projectId) => {
    state.projects = state.projects.filter((p) => p.id !== projectId)
    storeProject(state.projects)
    sendBackIpc(Handler.Remove, { projectId })
  }),
  removeProjectThunk: thunk((actions, projectId) => {
    actions.closeProjectThunk(projectId)
    actions.removeProject(projectId)
  }),

  setProjectView: action((state, { projectId, view }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.view = view
    judgeFrontView(project)
  }),
  setProjectViewHistory: action((state, { projectId, isView }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.viewHistory = isView
    if (isView) {
      project.view = ProjectViewWithRuntime.BrowserView
      judgeFrontView(project)
    }
  }),
  setTailwindConfig: action((state, { projectId, config }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.tailwindConfig = config
  }),

  pushRunningOutput: action((state, { projectId, output }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      if (!project.runningOutput) project.runningOutput = []
      project.runningOutput.push(output)
    }
  }),
  emptyRunningOutput: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.runningOutput = []
    }
  }),

  setStartLoading: action((state, { projectId, loading }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.startloading = loading
    }
  }),

  flushProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      sendBackIpc(Handler.Flush, { projectId: project.id })
    }
  }),
  setFrontProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isFront = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isFront = true
      project.isOpened = true
      sendBackIpc(Handler.Flush, { projectId: project.id })
    }
    judgeFrontView(project)
  }),

  startProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return

    actions.emptyRunningOutput(projectId)
    actions.setStartLoading({ projectId, loading: true })
    actions.setProjectView({ projectId, view: ProjectViewWithRuntime.Debugging })
    const reply = (await sendBackIpc(Handler.Start, { projectId })) as BoolReply
    if (!reply.result) {
      actions.setStartLoading({ projectId, loading: false })
      toast({
        title: reply.error,
        status: 'error',
      })
    }
  }),
  stopProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      sendBackIpc(Handler.Stop, { projectId })
    }
  }),

  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return
    actions.setFrontProject(project.id)
    await actions.startProject(project.id)
  }),
  closeProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = true
  }),
  closeProjectThunk: thunk((actions, projectId, { getState }) => {
    const { projects, openedProjects, frontProject } = getState()

    const project = projectId ? projects.find((p) => p.id === projectId) : frontProject
    if (!project) {
      throw new Error('closeProject null')
    }

    actions.closeProject(project.id)
    sendBackIpc(Handler.Stop, { projectId })
    sendMainIpc(MainIpcChannel.DestroyProjectView, projectId)

    if (project.isFront) {
      // match chrome-tabs.js:243
      const oindex = openedProjects.findIndex((p) => p.id === project.id)
      if (oindex >= 0) {
        if (oindex + 1 < openedProjects.length) {
          actions.setFrontProject(openedProjects[oindex + 1].id)
        } else if (oindex - 1 >= 0) {
          actions.setFrontProject(openedProjects[oindex - 1].id)
        } else {
          actions.setFrontProject(null)
        }
      }
    }
  }),

  loadStore: thunk(async (actions) => {
    const projects = sendMainIpcSync(MainIpcChannel.GetStore, 'projects') as Array<ProjectWithRuntime> | undefined
    if (!projects) return

    actions.setProjects(projects)
    await Promise.all(
      projects.map(async (project) => {
        const { id: projectId, url, path, branch } = project

        const payload: ImportPayloadWithRuntime = { projectId, url, path, branch }
        const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
        if (result) {
          sendBackIpc(Handler.Install, { projectId })
        } else {
          toast({
            title: `Import error: ${error}`,
            status: 'error',
          })
        }
      }),
    )
  }),

  setProjectStatus: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.projectId)
    if (!project) return

    project.config = payload.config

    if (payload.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
      project.startloading = false
      project.view = ProjectViewWithRuntime.BrowserView
      judgeFrontView(project)
      sendMainIpc(MainIpcChannel.LoadURL, project.id, '')
    }

    project.status = payload.status
    project.changes = payload.changes
    project.tailwindVersion = payload.tailwindVersion
    project.tailwindConfig = payload.tailwindConfig
    storeProject(state.projects)
  }),

  listen: thunk(async (actions, none, { getState, getStoreActions }) => {
    actions.unlisten()

    listenBackIpc(Broadcast.Status, (payload: StatusPayloadWithRuntime | PayloadError) => {
      if ((payload as PayloadError).error) {
        toast({
          title: `Status error:${(payload as PayloadError).error}`,
          status: 'error',
        })
        return
      }

      actions.setProjectStatus(payload as StatusPayloadWithRuntime)
    })

    listenBackIpc(Broadcast.Starting, (payload: ProcessPayload) => {
      if (payload.error) {
        actions.setStartLoading({ projectId: payload.projectId, loading: false })
        toast({
          title: `Starting error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.id === payload.projectId)
      if (!project) return

      const { id: projectId } = project

      if (payload.stdout) {
        actions.pushRunningOutput({ projectId, output: `stdout: ${payload.stdout}` })
      } else if (payload.stderr) {
        actions.pushRunningOutput({ projectId, output: `stderr: ${payload.stderr}` })
      } else if (payload.exit !== undefined) {
        actions.pushRunningOutput({ projectId, output: `exit: ${payload.error}` })
        actions.setStartLoading({ projectId, loading: false })
      }
    })

    listenMainIpc(MainIpcChannel.Shortcut, (event: IpcRendererEvent, key: string) => {
      const { frontProject, colorsModalShow } = getState()
      if (!frontProject) return

      if (key === 'Image Manager') {
        actions.toggleImagesModal(undefined)
      } else if (key === 'Colors Manager') {
        actions.colorsModalToggle({ show: !colorsModalShow })
      } else if (key === 'Undo') {
        getStoreActions().element.revokeHistory(frontProject.id)
      } else if (key === 'Redo') {
        getStoreActions().element.redoHistory(frontProject.id)
      }
    })

    listenMainIpc(MainIpcChannel.CloseFrontProject, (event: IpcRendererEvent) => {
      actions.closeProjectThunk()
    })

    listenMainIpc(MainIpcChannel.Flush, (event: IpcRendererEvent, projectId: string) => {
      actions.flushProject(projectId)
    })

    listenMainIpc(MainIpcChannel.LoadStart, (event: IpcRendererEvent, projectId: string) => {
      actions.setProjectView({ projectId, view: ProjectViewWithRuntime.Loading })
    })

    listenMainIpc(MainIpcChannel.LoadFinish, (event: IpcRendererEvent, projectId: string, ok: boolean) => {
      actions.setProjectView({
        projectId,
        view: ok ? ProjectViewWithRuntime.BrowserView : ProjectViewWithRuntime.LoadFail,
      })
      if (!ok) actions.setProjectViewHistory({ projectId, isView: false })
    })

    listenMainIpc(MainIpcChannel.Toast, (event: IpcRendererEvent, title: string, status: AlertStatus) => {
      toast({ title, status })
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenBackIpc(Broadcast.Starting)
    unlistenMainIpc(MainIpcChannel.Shortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
    unlistenMainIpc(MainIpcChannel.Flush)
    unlistenMainIpc(MainIpcChannel.LoadStart)
    unlistenMainIpc(MainIpcChannel.LoadFinish)
    unlistenMainIpc(MainIpcChannel.Toast)
  }),

  importModalDisclosure: false,
  toggleImportModal: action((state, open) => {
    if (open === false || state.importModalDisclosure) {
      judgeFrontView(state.frontProject)
      state.importModalDisclosure = false
    } else {
      judgeFrontView(undefined)
      state.importModalDisclosure = true
    }
  }),

  imagesModalDisclosure: false,
  toggleImagesModal: action((state, open) => {
    if (open === false || state.imagesModalDisclosure) {
      judgeFrontView(state.frontProject)
      state.imagesModalDisclosure = false
    } else {
      judgeFrontView(undefined)
      state.imagesModalDisclosure = true
    }
  }),
  modalImages: computed((state) => {
    if (!state.frontProject?.tailwindConfig?.theme.backgroundImage) return []
    const images: Array<BackgroundImage> = []
    for (const [name, value] of Object.entries(state.frontProject.tailwindConfig.theme.backgroundImage)) {
      const regValues = CssUrlReg.exec(value)
      if (regValues && regValues.length > 1) {
        images.push({
          name,
          webPath: regValues[1],
        })
      }
    }
    return images
  }),

  colorsModalShow: false,
  colorsModalData: undefined,
  colorsModalToggle: action((state, { show, colors, theme }) => {
    if (show) {
      judgeFrontView(undefined)
      state.colorsModalShow = true
      if (colors && theme) {
        state.colorsModalData = { colors, theme }
      }
    } else {
      judgeFrontView(state.frontProject)
      state.colorsModalShow = false
      state.colorsModalData = undefined
    }
  }),

  gitHistorys: [],
  setGitHistorys: action((state, payload) => {
    state.gitHistorys = payload
  }),

  callGitHistory: thunk(async (actions, none, { getState }) => {
    actions.setGitHistorys([])

    const { frontProject } = getState()
    if (!frontProject) return

    const reply = (await sendBackIpc(Handler.History, { projectId: frontProject.id })) as HistoryReply
    if (reply.error) {
      toast({
        title: `callGitHistory error: ${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setGitHistorys(reply.result)
    }
  }),

  setJitClassName: action((state, { projectId, className }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.jitClassName = className
    }
  }),
}

export default projectModel
