import type { IpcRendererEvent } from 'electron'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import omit from 'lodash.omit'
import dayjs from 'dayjs'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import type { StoreModel } from './index'
import type {
  ProjectConfig,
  ProcessPayload,
  CommitLog,
  StatusPayload,
  PayloadError,
  HistoryReply,
  BoolReply,
  GitFileChanges,
} from '../backend/backend.interface'
import { Broadcast, Handler, ProjectStatus } from '../backend/backend.interface'
import { ElementPayload, MainIpcChannel, ImportPayload } from '../interface'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const {
  sendBackIpc,
  listenBackIpc,
  unlistenBackIpc,
  listenMainIpc,
  unlistenMainIpc,
  sendMainIpc,
  sendMainIpcSync,
} = window.derealize

// export type Element = Omit<ElementPayload, 'projectId'>

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
}

export interface Project {
  id: string
  url: string
  path: string
  editedTime: string
  name: string
  branch: string
  isOpened?: boolean
  isFront?: boolean
  status?: ProjectStatus
  changes?: Array<GitFileChanges>
  config?: ProjectConfig
  // page?: string
  runningOutput?: Array<string>
  tailwindVersion?: string
  tailwindConfig?: TailwindConfig
  element?: ElementPayload
  view?: ProjectView
  startloading?: boolean
}

export const OmitStoreProp = [
  'isOpened',
  'isFront',
  'stage',
  'changes',
  'runningOutput',
  'installOutput',
  'config',
  'tailwindConfig',
  'element',
  'view',
  'startloading',
]

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

const storeProject = (projects: Array<Project>) => {
  // proxy object can't serialize https://stackoverflow.com/a/60344844
  const omitProjects = projects.map((p) => omit(p, OmitStoreProp))
  sendMainIpc(MainIpcChannel.SetStore, { projects: clone(omitProjects) })
}

const mainFrontView = (project?: Project) => {
  if (project?.view === ProjectView.BrowserView) {
    if (!project.config) throw new Error('project.config null')
    sendMainIpc(MainIpcChannel.FrontView, project.id, project.config.lunchUrl, [...project.config.pages])
  } else {
    sendMainIpc(MainIpcChannel.FrontView)
  }
}

export interface ProjectModel {
  projects: Array<Project>
  setProjects: Action<ProjectModel, Array<Project>>

  openedProjects: Computed<ProjectModel, Array<Project>>
  frontProject: Computed<ProjectModel, Project | undefined>
  isReady: Computed<ProjectModel, (id: string) => boolean | undefined>

  addProject: Action<ProjectModel, Project>
  setProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  removeProjectThunk: Thunk<ProjectModel, string>

  pushRunningOutput: Action<ProjectModel, { projectId: string; output: string }>
  emptyRunningOutput: Action<ProjectModel, string>
  setStartLoading: Action<ProjectModel, { projectId: string; loading: boolean }>
  setProjectView: Action<ProjectModel, { projectId: string; view: ProjectView }>

  setFrontProject: Action<ProjectModel, string | null>
  setFrontProjectThunk: Thunk<ProjectModel, string | null, void, StoreModel>

  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>
  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel, void, void, StoreModel>
  unlisten: Action<ProjectModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>

  // setPage: Action<ProjectModel, { projectId: string; page: string }>
}

const projectModel: ProjectModel = {
  projects: [],
  setProjects: action((state, projects) => {
    state.projects = [...projects]
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
  setProject: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.id)
    if (!project) throw new Error("project don't exist")
    Object.assign(project, payload)
    storeProject(state.projects)
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

  setFrontProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isFront = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isFront = true
      sendBackIpc(Handler.CheckStatus, { projectId: project.id })
    }
    mainFrontView(project)
  }),
  setFrontProjectThunk: thunk(async (actions, projectId, { getState, getStoreActions }) => {
    actions.setFrontProject(projectId)
    const project = getState().projects.find((p) => p.id === projectId)
    if (project) {
      getStoreActions().controlles.setElementThunk(project.element)
    } else {
      getStoreActions().controlles.setElementThunk(undefined)
    }
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
  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = true
    await actions.setFrontProjectThunk(project.id)
    await actions.startProject(project.id)
  }),
  closeProject: thunk((actions, projectId, { getState }) => {
    const { projects, openedProjects } = getState()
    const project = projects.find((p) => p.id === projectId)
    if (!project) throw new Error('closeProject null')
    project.isOpened = false

    if (project.isFront) {
      project.isFront = false
      // match chrome-tabs.js:243
      const oindex = openedProjects.findIndex((p) => p.id === project.id)
      if (oindex >= 0) {
        if (oindex + 1 < openedProjects.length) {
          actions.setFrontProjectThunk(openedProjects[oindex + 1].id)
        } else if (oindex - 1 >= 0) {
          actions.setFrontProjectThunk(openedProjects[oindex - 1].id)
        } else {
          actions.setFrontProjectThunk(null)
        }
      }
    }

    actions.setProject(project)
    sendBackIpc(Handler.Stop, { projectId })
    sendMainIpc(MainIpcChannel.DestroyProjectView, projectId)
  }),

  loadStore: thunk(async (actions) => {
    const projects = sendMainIpcSync(MainIpcChannel.GetStore, 'projects') as Array<Project> | undefined
    if (projects) {
      actions.setProjects(projects)
    }

    projects?.forEach(async (project) => {
      const { id: projectId, url, path, branch } = project

      const payload: ImportPayload = { projectId, url, path, branch }
      const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
      if (result) {
        sendBackIpc(Handler.Install, { projectId })
        project.tailwindConfig = (await sendBackIpc(Handler.GetTailwindConfig, { projectId })) as TailwindConfig
      } else {
        toast({
          title: `Import error: ${error}`,
          status: 'error',
        })
      }
    })
  }),

  listen: thunk(async (actions, none, { getState, getStoreActions }) => {
    actions.unlisten()

    listenBackIpc(Broadcast.Status, (payload: StatusPayload | PayloadError) => {
      if ((payload as PayloadError).error) {
        toast({
          title: `Status error:${(payload as PayloadError).error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.id === payload.projectId)
      if (!project) return

      const status = payload as StatusPayload
      project.config = status.config

      if (status.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
        project.startloading = false
        project.view = ProjectView.BrowserView
        mainFrontView(project)
        sendMainIpc(MainIpcChannel.LoadURL, project.id, '')
      }

      project.status = status.status
      project.changes = status.changes
      project.tailwindVersion = status.tailwindVersion
      // if (!project.page && status.config.pages.length) {
      //   project.page = status.config.pages[0]
      // }

      actions.setProject(project)
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

    listenMainIpc(MainIpcChannel.FocusElement, (event: IpcRendererEvent, payload: ElementPayload) => {
      const { projects, frontProject } = getState()
      const project = projects.find((p) => p.id === payload.projectId)
      if (!project) return

      project.element = payload.tagName ? payload : undefined
      if (project.id === frontProject?.id) {
        getStoreActions().controlles.setElementThunk(project.element)
      }
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenBackIpc(Broadcast.Starting)
    unlistenMainIpc(MainIpcChannel.FocusElement)
  }),

  modalDisclosure: false,
  setModalOpen: action((state) => {
    state.modalDisclosure = true
  }),
  setModalClose: action((state) => {
    state.modalDisclosure = false
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

  // setPage: action((state, { projectId, page }) => {
  //   const project = state.projects.find((p) => p.id === projectId)
  //   if (project && project.config) {
  //     project.page = page
  //     sendMainIpc(MainIpcChannel.LoadURL, project.id, project.config.lunchUrl + page)
  //   }
  // }),
}

export default projectModel
