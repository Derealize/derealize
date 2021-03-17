import sysPath from 'path'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import omit from 'lodash.omit'
import dayjs from 'dayjs'
import resolveConfig from 'tailwindcss/resolveConfig'
import {
  ProjectStage,
  ProcessPayload,
  CommitLog,
  StatusPayload,
  PayloadError,
  HistoryReply,
  BoolReply,
} from '../backend/project.interface'
import Project, { ProjectView, OmitStoreProp } from './project.interface'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore, send, listen, unlisten, frontProjectView, closeProjectView } = window.derealize

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
  loading: boolean
  setLoading: Action<ProjectModel, boolean>

  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, Array<Project>>
  initProjects: Action<ProjectModel>

  addProject: Action<ProjectModel, Project>
  removeProject: Thunk<ProjectModel, string>
  setProject: Action<ProjectModel, Project>
  resolveTailwindcssConfig: Action<ProjectModel, string>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  openProject: Thunk<ProjectModel, string>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel>
  unlisten: Action<ProjectModel>

  projectView: ProjectView
  setProjectView: Action<ProjectModel, ProjectView>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>
}

const projectModel: ProjectModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  projects: [],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  setProjects: action((state, payload) => {
    state.projects = payload
    storeProject(state.projects)
  }),
  initProjects: action((state) => {
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
  setProject: action((state, project) => {
    const fproject = state.projects.find((p) => p.url === project.url)
    if (!fproject) {
      toast({
        title: "project don't exist",
        status: 'error',
      })
      return
    }

    Object.assign(fproject, project)
    storeProject(state.projects)
  }),
  resolveTailwindcssConfig: action((state, id) => {
    const project = state.projects.find((p) => p.url === id)
    if (!project) {
      toast({
        title: "project don't exist",
        status: 'error',
      })
      return
    }

    import(sysPath.join(project.path, './tailwind.config.js'))
      .then((customConfig) => {
        project.tailwindConfig = resolveConfig(customConfig)
        return undefined
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: 'error',
        })
      })
  }),

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
    if (!project) {
      frontProjectView()
      return
    }
    send('CheckStatus', { url: project.url })
  }),

  openProject: thunk(async (actions, id, { getState }) => {
    const project = getState().projects.find((p) => p.url === id)
    if (!project) return

    project.isOpened = true
    actions.setFrontProject(project)

    actions.setProjectView(ProjectView.BrowserView)
    // actions.startProject(project.url)
  }),
  startProject: thunk(async (actions, id, { getState }) => {
    const { projects } = getState()
    const project = projects.find((p) => p.url === id)
    if (!project) return

    actions.setLoading(true)
    const reply = (await send('Start', { url: project.url })) as BoolReply
    if (reply.result) {
      project.runningOutput = []
    } else {
      actions.setLoading(false)
      toast({
        title: reply.error,
        status: 'error',
      })
    }
  }),
  stopProject: action((state, id) => {
    const project = state.projects.find((p) => p.url === id)
    if (project) {
      send('Stop', { url: project.url })
    }
  }),
  closeProject: thunk((actions, id, { getState }) => {
    const { projects, frontProject, openedProjects } = getState()
    const project = projects.find((p) => p.url === id)
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

    send('Stop', { url: project.url })
    closeProjectView(project.url)
    actions.setProjects(projects)
  }),

  loadStore: thunk((actions, none, { getState }) => {
    actions.initProjects()
    const { projects } = getState()

    projects?.forEach(async (project: Project) => {
      const { url, path, config } = project
      const branch = config?.branch

      const { result, error } = (await send('Import', { url, path, branch })) as BoolReply
      if (result) {
        send('Install', { url, path, branch })
        actions.resolveTailwindcssConfig(url)
      } else {
        project.installOutput?.push(`import error: ${error}`)
      }
    })
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()

    listen('status', (payload: StatusPayload | PayloadError) => {
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
        actions.setLoading(project.stage === ProjectStage.Starting)
        if (status.stage === ProjectStage.Running && project.stage !== ProjectStage.Running) {
          actions.setProjectView(ProjectView.BrowserView)
        }
      }

      project.stage = status.stage
      project.changes = status.changes
      project.productName = status.productName
      project.tailwindVersion = status.tailwindVersion

      actions.setProject(project)
    })

    listen('install', (payload: ProcessPayload) => {
      if (payload.error) {
        actions.setLoading(false)
        toast({
          title: `Install error:${payload.error}`,
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
        actions.setLoading(false)
      }
    })

    listen('starting', (payload: ProcessPayload) => {
      if (payload.error) {
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
      }
    })
  }),

  unlisten: action(() => {
    unlisten('status')
    unlisten('install')
    unlisten('starting')
  }),

  projectView: ProjectView.BrowserView,
  setProjectView: action((state, payload) => {
    state.projectView = payload
    if (payload === ProjectView.BrowserView && state.frontProject) {
      frontProjectView(clone(state.frontProject))
    } else {
      frontProjectView()
    }
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

  callHistory: thunk(async (actions, id, { getState }) => {
    actions.setHistorys([])

    const { frontProject } = getState()
    if (!frontProject) return

    const reply = (await send('History', { url: frontProject.url })) as HistoryReply
    if (reply.error) {
      toast({
        title: `History error:${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setHistorys(reply.result)
    }
  }),
}

export default projectModel
