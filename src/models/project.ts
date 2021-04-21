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
import { ElementPayload, MainIpcChannel } from '../interface'
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

export type Element = Omit<ElementPayload, 'projectId'>

export interface Project {
  url: string
  path: string
  editedTime: string
  name: string
  productName?: string
  isOpened?: boolean
  status?: ProjectStatus
  changes?: Array<GitFileChanges>
  config?: ProjectConfig
  page?: string
  installOutput?: Array<string>
  runningOutput?: Array<string>
  tailwindVersion?: string
  tailwindConfig?: TailwindConfig
  element?: Element
}

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
}

export const OmitStoreProp = [
  'isOpened',
  'stage',
  'changes',
  'runningOutput',
  'installOutput',
  'config',
  'tailwindConfig',
  'element',
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

export interface ProjectModel {
  startloading: boolean
  setStartLoading: Action<ProjectModel, boolean>

  importloading: boolean
  setImportLoading: Action<ProjectModel, boolean>

  runningOutput: Array<string>
  setRunningOutput: Action<ProjectModel, Array<string>>

  installOutput: Array<string>
  setInstallOutput: Action<ProjectModel, Array<string>>

  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, Array<Project>>
  getStoreProjects: Action<ProjectModel>

  addProject: Action<ProjectModel, Project>
  removeProject: Thunk<ProjectModel, string>
  setProject: Action<ProjectModel, Project>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>
  setFrontProjectThunk: Thunk<ProjectModel, Project | null, void, StoreModel>
  frontProjectView: ProjectView
  setFrontProjectView: Action<ProjectModel, ProjectView>

  openProject: Thunk<ProjectModel, string>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>
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

  setPage: Action<ProjectModel, { projectId: string; page: string }>
}

const projectModel: ProjectModel = {
  startloading: false,
  setStartLoading: action((state, payload) => {
    state.startloading = payload
  }),

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
  removeProject: thunk((actions, url, { getState }) => {
    actions.closeProject(url)
    const projects = getState().projects.filter((p) => p.url !== url)
    actions.setProjects(projects)
    sendBackIpc(Handler.Remove, { url })
  }),
  setProject: action((state, payload) => {
    const project = state.projects.find((p) => p.url === payload.url)
    if (!project) {
      throw new Error("project don't exist")
    }

    Object.assign(project, payload)
    state.projects = [...state.projects]
    storeProject(state.projects)
  }),

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
  }),
  setFrontProjectThunk: thunk(async (actions, project, { getStoreActions }) => {
    actions.setFrontProject(project)
    if (!project) {
      sendMainIpc(MainIpcChannel.FrontMain)
      return
    }

    if (project.element) {
      getStoreActions().controlles.setElement({ ...project.element, projectId: project.url })
    }
    await sendBackIpc(Handler.CheckStatus, { url: project.url })
  }),

  frontProjectView: ProjectView.BrowserView,
  setFrontProjectView: action((state, payload) => {
    state.frontProjectView = payload
    const project = state.frontProject
    if (project && payload === ProjectView.BrowserView) {
      if (!project.config) throw new Error('project.config null')
      sendMainIpc(MainIpcChannel.FrontProjectWeb, project.url, project.config.lunchUrl, [...project.config.pages])
    } else {
      sendMainIpc(MainIpcChannel.FrontMain)
    }
  }),

  openProject: thunk(async (actions, url, { getState }) => {
    const project = getState().projects.find((p) => p.url === url)
    if (!project) return

    project.isOpened = true
    await actions.startProject(project.url)
    actions.setFrontProjectThunk(project)
  }),
  startProject: thunk(async (actions, url, { getState }) => {
    const project = getState().projects.find((p) => p.url === url)
    if (!project) return

    actions.setStartLoading(true)
    project.runningOutput = []
    actions.setRunningOutput([])
    actions.setFrontProjectView(ProjectView.Debugging)
    const reply = (await sendBackIpc(Handler.Start, { url: project.url })) as BoolReply
    if (!reply.result) {
      actions.setStartLoading(false)
      toast({
        title: reply.error,
        status: 'error',
      })
    }
  }),
  stopProject: action((state, url) => {
    const project = state.projects.find((p) => p.url === url)
    if (project) {
      sendBackIpc(Handler.Stop, { url: project.url })
    }
  }),
  closeProject: thunk((actions, url, { getState }) => {
    const { projects, frontProject, openedProjects } = getState()
    const project = projects.find((p) => p.url === url)
    if (!project) throw new Error('closeProject null')
    project.isOpened = false

    if (project.url === frontProject?.url) {
      // match chrome-tabs.js:243
      const oindex = openedProjects.findIndex((p) => p.url === project.url)
      if (oindex >= 0) {
        if (oindex + 1 < openedProjects.length) {
          actions.setFrontProjectThunk(openedProjects[oindex + 1])
        } else if (oindex - 1 >= 0) {
          actions.setFrontProjectThunk(openedProjects[oindex - 1])
        } else {
          actions.setFrontProjectThunk(null)
        }
      }
    }

    sendBackIpc(Handler.Stop, { url: project.url })
    sendMainIpc(MainIpcChannel.CloseProjectView, project.url)
    actions.setProjects(projects)
  }),

  loadStore: thunk(async (actions, none, { getState }) => {
    actions.getStoreProjects()
    const { projects } = getState()

    projects?.forEach(async (project: Project) => {
      const { url, path, config } = project
      const branch = config?.branch

      const { result, error } = (await sendBackIpc(Handler.Import, { url, path, branch })) as BoolReply
      if (result) {
        sendBackIpc(Handler.Install, { url, path, branch })
        project.tailwindConfig = (await sendBackIpc(Handler.GetTailwindConfig, { url })) as TailwindConfig
      } else {
        toast({
          title: `Import error:${error}`,
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

      const { projects, frontProject } = getState()
      const project = projects.find((p) => p.url === payload.id)
      if (!project) return

      const status = payload as StatusPayload
      project.config = status.config
      if (!project.page && status.config.pages.length) {
        project.page = status.config.pages[0]
      }

      if (frontProject === project) {
        if (status.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
          actions.setStartLoading(false)
          actions.setFrontProjectView(ProjectView.BrowserView)
        }
      }

      // console.log('project.status = status.status', project.url, status.status)
      project.status = status.status
      project.changes = status.changes
      project.productName = status.productName
      project.tailwindVersion = status.tailwindVersion

      actions.setProject(project)
    })

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
      const project = projects.find((p) => p.url === payload.id)
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

    listenBackIpc(Broadcast.Starting, (payload: ProcessPayload) => {
      if (payload.error) {
        actions.setStartLoading(false)
        actions.setFrontProjectView(ProjectView.Debugging)
        toast({
          title: `Starting error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.url === payload.id)
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
        actions.setStartLoading(false)
      }
      actions.setRunningOutput(project.runningOutput)
    })

    listenMainIpc(MainIpcChannel.FocusElement, (event: IpcRendererEvent, payload: ElementPayload) => {
      const { openedProjects, frontProject } = getState()
      const project = openedProjects.find((p) => p.url === payload.projectId)
      if (!project) return

      project.element = payload.tagName ? payload : undefined
      if (project === frontProject && project.element) {
        getStoreActions().controlles.setElement({ ...project.element, projectId: project.url })
      }
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenBackIpc(Broadcast.Installing)
    unlistenBackIpc(Broadcast.Starting)
    unlistenMainIpc(MainIpcChannel.FocusElement)
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

    const reply = (await sendBackIpc(Handler.History, { url: frontProject.url })) as HistoryReply
    if (reply.error) {
      toast({
        title: `callHistory error:${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setHistorys(reply.result)
    }
  }),

  setPage: action((state, { projectId, page }) => {
    const project = state.projects.find((p) => p.url === projectId)
    if (project && project.config) {
      project.page = page
      sendMainIpc(MainIpcChannel.LoadURL, project.url, project.config.lunchUrl + page)
    }
  }),
}

export default projectModel
