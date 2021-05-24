/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import type { StoreModel } from './index'
import type {
  ProcessPayload,
  CommitLog,
  StatusPayload,
  PayloadError,
  HistoryReply,
  BoolReply,
} from '../backend/backend.interface'
import { Broadcast, Handler, ProjectStatus } from '../backend/backend.interface'
import { ProjectView, Project, BackgroundImage } from './project.interface'
import { MainIpcChannel, ImportPayload } from '../interface'
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

const mainFrontView = (project?: Project) => {
  if (project?.view === ProjectView.BrowserView) {
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

export interface ProjectModel {
  projects: Array<Project>
  setProjects: Action<ProjectModel, Array<Project>>

  editingProject: Computed<ProjectModel, Project | undefined>
  setEditingProject: Action<ProjectModel, string | null>
  editProject: Action<ProjectModel, { displayname: string; branch: string }>

  openedProjects: Computed<ProjectModel, Array<Project>>
  frontProject: Computed<ProjectModel, Project | undefined>
  isReady: Computed<ProjectModel, (id: string) => boolean | undefined>

  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  removeProjectThunk: Thunk<ProjectModel, string>

  pushRunningOutput: Action<ProjectModel, { projectId: string; output: string }>
  emptyRunningOutput: Action<ProjectModel, string>
  setStartLoading: Action<ProjectModel, { projectId: string; loading: boolean }>
  setProjectView: Action<ProjectModel, { projectId: string; view: ProjectView }>
  setTailwindConfig: Action<ProjectModel, { projectId: string; config: TailwindConfig }>

  flushProject: Action<ProjectModel, string>
  setFrontProject: Action<ProjectModel, string | null>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>

  toggleProject: Action<ProjectModel, { projectId: string; open: boolean }>
  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string | undefined>

  setProjectStatus: Action<ProjectModel, StatusPayload>
  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel, void, void, StoreModel>
  unlisten: Action<ProjectModel>

  importModalDisclosure: boolean
  toggleImportModal: Action<ProjectModel, boolean | undefined>

  backgroundsModalDisclosure: boolean
  toggleBackgroundsModal: Action<ProjectModel, boolean | undefined>
  backgroundImages: Computed<ProjectModel, BackgroundImage[]>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>

  setJitClassName: Action<ProjectModel, { projectId: string; className: string }>
}

const projectModel: ProjectModel = {
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
      mainFrontView(undefined)
    } else {
      mainFrontView(state.frontProject)
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
    actions.closeProject(projectId)
    actions.removeProject(projectId)
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
  setProjectView: action((state, { projectId, view }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.view = view
    if (project.id === state.frontProject?.id) {
      mainFrontView(project)
    }
  }),
  setTailwindConfig: action((state, { projectId, config }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.tailwindConfig = config
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
      sendBackIpc(Handler.Flush, { projectId: project.id })
    }
    mainFrontView(project)
  }),

  startProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return

    actions.emptyRunningOutput(projectId)
    actions.setStartLoading({ projectId, loading: true })
    actions.setProjectView({ projectId, view: ProjectView.Debugging })
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

  toggleProject: action((state, { projectId, open }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = open
  }),
  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return
    actions.toggleProject({ projectId, open: true })
    await actions.setFrontProject(project.id)
    await actions.startProject(project.id)
  }),
  closeProject: thunk((actions, projectId, { getState }) => {
    const { projects, openedProjects, frontProject } = getState()

    const project = projectId ? projects.find((p) => p.id === projectId) : frontProject
    if (!project) {
      throw new Error('closeProject null')
    }

    actions.toggleProject({ projectId: project.id, open: false })
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
    const projects = sendMainIpcSync(MainIpcChannel.GetStore, 'projects') as Array<Project> | undefined
    if (!projects) return

    await Promise.all(
      projects.map(async (project) => {
        const { id: projectId, url, path, branch } = project

        const payload: ImportPayload = { projectId, url, path, branch }
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

    actions.setProjects(projects)
  }),

  setProjectStatus: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.projectId)
    if (!project) return

    project.config = payload.config

    if (payload.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
      project.startloading = false
      project.view = ProjectView.BrowserView
      mainFrontView(project)
      sendMainIpc(MainIpcChannel.LoadURL, project.id, '')
    }

    project.status = payload.status
    project.changes = payload.changes
    project.tailwindVersion = payload.tailwindVersion
    project.tailwindConfig = payload.tailwindConfig
    storeProject(state.projects)
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()

    listenBackIpc(Broadcast.Status, (payload: StatusPayload | PayloadError) => {
      if ((payload as PayloadError).error) {
        toast({
          title: `Status error:${(payload as PayloadError).error}`,
          status: 'error',
        })
        return
      }

      actions.setProjectStatus(payload as StatusPayload)
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
      const { frontProject } = getState()
      if (!frontProject) return

      if (key === 'Image Modal') {
        actions.toggleBackgroundsModal(undefined)
      }
    })

    listenMainIpc(MainIpcChannel.CloseFrontProject, (event: IpcRendererEvent) => {
      actions.closeProject()
    })

    listenMainIpc(MainIpcChannel.Flush, (event: IpcRendererEvent, projectId: string) => {
      actions.flushProject(projectId)
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenBackIpc(Broadcast.Starting)
    unlistenMainIpc(MainIpcChannel.Shortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
    unlistenMainIpc(MainIpcChannel.Flush)
  }),

  importModalDisclosure: false,
  toggleImportModal: action((state, open) => {
    if (open === false || state.importModalDisclosure) {
      mainFrontView(state.frontProject)
      state.importModalDisclosure = false
    } else {
      mainFrontView(undefined)
      state.importModalDisclosure = true
    }
  }),

  backgroundsModalDisclosure: false,
  toggleBackgroundsModal: action((state, open) => {
    if (open === false || state.backgroundsModalDisclosure) {
      mainFrontView(state.frontProject)
      state.backgroundsModalDisclosure = false
    } else {
      mainFrontView(undefined)
      state.backgroundsModalDisclosure = true
    }
  }),
  backgroundImages: computed((state) => {
    if (!state.frontProject?.tailwindConfig) return []
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

  historys: [],
  setHistorys: action((state, payload) => {
    state.historys = payload
  }),

  callHistory: thunk(async (actions, none, { getState }) => {
    actions.setHistorys([])

    const { frontProject } = getState()
    if (!frontProject) return

    const reply = (await sendBackIpc(Handler.History, { projectId: frontProject.id })) as HistoryReply
    if (reply.error) {
      toast({
        title: `callHistory error: ${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setHistorys(reply.result)
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
