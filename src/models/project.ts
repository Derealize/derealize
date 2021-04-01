import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import omit from 'lodash.omit'
import dayjs from 'dayjs'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
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
import { Broadcast, Handler, ProjectStage } from '../backend/backend.interface'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore, send, listen, unlisten, frontMain, frontProjectWeb, closeProjectView } = window.derealize

export interface Project {
  url: string
  path: string
  editedTime: string
  name: string
  productName?: string
  isOpened?: boolean
  stage?: ProjectStage
  changes?: Array<GitFileChanges>
  config?: ProjectConfig
  installOutput?: Array<string>
  runningOutput?: Array<string>
  tailwindVersion?: string
  tailwindConfig?: TailwindConfig
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
  setStore({ projects: clone(omitProjects) })
}

export interface ProjectModel {
  startloading: boolean
  setStartLoading: Action<ProjectModel, boolean>

  importloading: boolean
  setImportLoading: Action<ProjectModel, boolean>

  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, Array<Project>>
  getStoreProjects: Action<ProjectModel>

  addProject: Action<ProjectModel, Project>
  removeProject: Thunk<ProjectModel, string>
  setProject: Action<ProjectModel, Project>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>
  frontProjectView: ProjectView
  setFrontProjectView: Action<ProjectModel, ProjectView>

  openProject: Thunk<ProjectModel, string>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel>
  unlisten: Action<ProjectModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>
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

  projects: [],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  setProjects: action((state, payload) => {
    state.projects = payload
    storeProject(state.projects)
  }),
  getStoreProjects: action((state) => {
    const projects = getStore('projects') as Array<Project> | undefined
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
  removeProject: thunk((actions, id, { getState }) => {
    actions.closeProject(id)
    const projects = getState().projects.filter((p) => p.url !== id)
    actions.setProjects(projects)
  }),
  setProject: action((state, payload) => {
    const project = state.projects.find((p) => p.url === payload.url)
    if (!project) {
      toast({
        title: "project don't exist",
        status: 'error',
      })
      return
    }

    Object.assign(project, payload)
    storeProject(state.projects)
  }),

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
    if (!project) {
      frontMain()
      return
    }
    send(Handler.CheckStatus, { url: project.url })
  }),
  frontProjectView: ProjectView.BrowserView,
  setFrontProjectView: action((state, payload) => {
    state.frontProjectView = payload
    if (state.frontProject && payload === ProjectView.BrowserView) {
      frontProjectWeb(clone(state.frontProject))
    } else {
      frontMain()
    }
  }),

  openProject: thunk(async (actions, url, { getState }) => {
    const project = getState().projects.find((p) => p.url === url)
    if (!project) return

    project.isOpened = true
    await actions.startProject(project.url)
    actions.setFrontProject(project)
  }),
  startProject: thunk(async (actions, url, { getState }) => {
    const project = getState().projects.find((p) => p.url === url)
    if (!project) return

    actions.setStartLoading(true)
    const reply = (await send(Handler.Start, { url: project.url })) as BoolReply
    if (reply.result) {
      project.runningOutput = []
    } else {
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
      send(Handler.Stop, { url: project.url })
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
          actions.setFrontProject(openedProjects[oindex + 1])
        } else if (oindex - 1 >= 0) {
          actions.setFrontProject(openedProjects[oindex - 1])
        } else {
          actions.setFrontProject(null)
        }
      }
    }

    send(Handler.Stop, { url: project.url })
    closeProjectView(project.url)
    actions.setProjects(projects)
  }),

  loadStore: thunk(async (actions, none, { getState }) => {
    actions.getStoreProjects()
    const { projects } = getState()

    projects?.forEach(async (project: Project) => {
      const { url, path, config } = project
      const branch = config?.branch

      const { result, error } = (await send(Handler.Import, { url, path, branch })) as BoolReply
      if (result) {
        send(Handler.Install, { url, path, branch })
        project.tailwindConfig = (await send(Handler.GetTailwindConfig, { url })) as TailwindConfig
      } else {
        toast({
          title: `Import error:${error}`,
          status: 'error',
        })
      }
    })
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()

    listen(Broadcast.Status, (payload: StatusPayload | PayloadError) => {
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

      if (frontProject === project) {
        if (status.stage === ProjectStage.Running && project.stage !== ProjectStage.Running) {
          actions.setStartLoading(false)
          actions.setFrontProjectView(ProjectView.BrowserView)
        }
      }

      project.stage = status.stage
      project.changes = status.changes
      project.productName = status.productName
      project.tailwindVersion = status.tailwindVersion

      actions.setProject(project)
    })

    listen(Broadcast.Installing, (payload: ProcessPayload) => {
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
    })

    listen(Broadcast.Starting, (payload: ProcessPayload) => {
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
        actions.setFrontProjectView(ProjectView.Debugging)
      }
    })
  }),

  unlisten: action(() => {
    unlisten(Broadcast.Status)
    unlisten(Broadcast.Installing)
    unlisten(Broadcast.Starting)
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

    const reply = (await send(Handler.History, { url: frontProject.url })) as HistoryReply
    if (reply.error) {
      toast({
        title: `callHistory error:${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setHistorys(reply.result)
    }
  }),
}

export default projectModel
