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
  installOutput?: Array<string>
  runningOutput?: Array<string>
  tailwindVersion?: string
  tailwindConfig?: TailwindConfig
  element?: ElementPayload
  projectView?: ProjectView
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
  'projectView',
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

const mainDisplayProject = (project?: Project) => {
  if (project?.projectView === ProjectView.BrowserView) {
    if (!project.config) throw new Error('project.config null')
    sendMainIpc(MainIpcChannel.FrontProjectWeb, project.id, project.config.lunchUrl, [...project.config.pages])
  } else {
    sendMainIpc(MainIpcChannel.FrontMain)
  }
}

export interface ProjectModel {
  importloading: boolean
  setImportLoading: Action<ProjectModel, boolean>

  runningOutput: Array<string>
  setRunningOutput: Action<ProjectModel, Array<string>>

  installOutput: Array<string>
  setInstallOutput: Action<ProjectModel, Array<string>>

  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  frontProject: Computed<ProjectModel, Project | undefined>
  isReady: Computed<ProjectModel, (id: string) => boolean>

  setProjects: Action<ProjectModel, Array<Project>>
  getStoreProjects: Action<ProjectModel>

  addProject: Action<ProjectModel, Project>
  removeProject: Thunk<ProjectModel, string>
  setProject: Action<ProjectModel, Project>

  setFrontProject: Action<ProjectModel, string | null>
  setFrontProjectThunk: Thunk<ProjectModel, string | null, void, StoreModel>

  setStartLoading: Action<ProjectModel, { projectId: string; loading: boolean }>
  setProjectView: Action<ProjectModel, { projectId: string; view: ProjectView }>

  openProject: Thunk<ProjectModel, string>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel, void, void, StoreModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>

  // setPage: Action<ProjectModel, { projectId: string; page: string }>
}

const projectModel: ProjectModel = {
  importloading: false,
  setImportLoading: action((state, payload) => {
    state.importloading = payload
  }),

  runningOutput: [],
  setRunningOutput: action((state, payload) => {
    state.runningOutput = [...payload]
  }),

  installOutput: [],
  setInstallOutput: action((state, payload) => {
    state.installOutput = [...payload]
  }),

  projects: [],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  frontProject: computed((state) => {
    return state.projects.find((p) => p.isFront)
  }),
  isReady: computed((state) => (id) => {
    return state.projects.find((p) => p.id === id)?.status === ProjectStatus.Ready
  }),

  setProjects: action((state, payload) => {
    state.projects = payload
    storeProject(state.projects)
  }),
  getStoreProjects: action((state) => {
    const projects = sendMainIpcSync(MainIpcChannel.GetStore, 'projects') as Array<Project> | undefined
    if (projects) {
      state.projects = projects
    }
  }),

  addProject: action((state, project) => {
    if (state.projects.some((p) => p.url === project.url)) {
      toast({
        title: 'project url existed',
        status: 'warning',
      })
      return
    }

    state.projects.push(project)
    storeProject(state.projects)
  }),
  removeProject: thunk((actions, projectId, { getState }) => {
    actions.closeProject(projectId)
    const projects = getState().projects.filter((p) => p.id !== projectId)
    actions.setProjects(projects)
    sendBackIpc(Handler.Remove, { projectId })
  }),
  setProject: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.id)
    if (!project) throw new Error("project don't exist")
    Object.assign(project, payload)
    storeProject(state.projects)
  }),

  setFrontProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isFront = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    mainDisplayProject(project)
    if (project) {
      project.isFront = true
      sendBackIpc(Handler.CheckStatus, { projectId: project.id })
    }
  }),
  setFrontProjectThunk: thunk(async (actions, projectId, { getState, getStoreActions }) => {
    // console.log('setFrontProjectThunk', projectId)
    actions.setFrontProject(projectId)
    const project = getState().projects.find((p) => p.id === projectId)
    if (project) {
      getStoreActions().controlles.setElementThunk(project.element)
    }
  }),

  setProjectView: action((state, { projectId, view }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.projectView = view

    if (project.id === state.frontProject?.id) {
      mainDisplayProject(project)
    }
  }),

  setStartLoading: action((state, { projectId, loading }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    // console.log('setStartLoading', loading)
    project.startloading = loading
  }),

  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = true
    await actions.setFrontProjectThunk(project.id)
    await actions.startProject(project.id)
  }),
  startProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return

    project.runningOutput = []
    actions.setRunningOutput([])
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
    sendMainIpc(MainIpcChannel.CloseProjectView, projectId)
  }),

  loadStore: thunk(async (actions, none, { getState }) => {
    actions.getStoreProjects()
    const { projects } = getState()

    projects?.forEach(async (project: Project) => {
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
    unlistenBackIpc(Broadcast.Status)
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

      if (status.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
        project.startloading = false
        project.projectView = ProjectView.BrowserView
        mainDisplayProject(project)
        sendMainIpc(MainIpcChannel.LoadURL, project.id, project.config?.lunchUrl)
      }

      project.status = status.status
      project.changes = status.changes
      project.tailwindVersion = status.tailwindVersion
      project.config = status.config
      // if (!project.page && status.config.pages.length) {
      //   project.page = status.config.pages[0]
      // }

      actions.setProject(project)
    })

    unlistenBackIpc(Broadcast.Installing)
    listenBackIpc(Broadcast.Installing, (payload: ProcessPayload) => {
      if (payload.error) {
        actions.setImportLoading(false)
        toast({
          title: `Installing error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.id === payload.projectId)
      if (!project) return

      if (!project.installOutput) {
        project.installOutput = []
      }

      if (payload.stdout) {
        project.installOutput.push(`stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        project.installOutput.push(`stderr:${payload.stderr}`)
      } else if (payload.exit !== undefined) {
        project.installOutput.push(`exit:${payload.error}`)
        actions.setImportLoading(false)
      }
      actions.setInstallOutput(project.installOutput)
    })

    unlistenBackIpc(Broadcast.Starting)
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

      if (!project.runningOutput) {
        project.runningOutput = []
      }

      if (payload.stdout) {
        project.runningOutput.push(`stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        project.runningOutput.push(`stderr:${payload.stderr}`)
      } else if (payload.exit !== undefined) {
        project.runningOutput.push(`exit:${payload.error}`)
        actions.setStartLoading({ projectId: payload.projectId, loading: false })
      }
      actions.setRunningOutput(project.runningOutput)
    })

    unlistenMainIpc(MainIpcChannel.FocusElement)
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

  modalDisclosure: false,
  setModalOpen: action((state) => {
    state.modalDisclosure = true
    state.installOutput = []
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
