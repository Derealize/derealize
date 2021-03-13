import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import omit from 'lodash.omit'
import dayjs from 'dayjs'
import {
  ProjectStage,
  ProcessPayload,
  CommitLog,
  StatusPayload,
  PayloadError,
  HistoryReply,
} from '../backend/project.interface'
import Project from './project.interface'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore, send, listen, frontProjectView, closeProjectView } = window.derealize

let statusUnlisten: () => void
let startingUnlisten: () => void

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

export interface ProjectModel {
  loading: boolean
  setLoading: Action<ProjectModel, boolean>
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; notStore?: boolean }>

  setProject: Action<ProjectModel, { project: Project; notStore?: boolean }>
  removeProject: Thunk<ProjectModel, string>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  openProject: Thunk<ProjectModel, string>
  startProject: Action<ProjectModel, string | undefined>
  stopProject: Action<ProjectModel, string | undefined>
  closeProject: Thunk<ProjectModel, string>

  load: Thunk<ProjectModel>
  listen: Thunk<ProjectModel>
  unlisten: Action<ProjectModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>

  debugging: boolean
  setDebugging: Action<ProjectModel, boolean>

  openStatus: boolean
  setOpenStatus: Action<ProjectModel, boolean>

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
  setProjects: action((state, { projects, notStore }) => {
    state.projects = projects
    if (!notStore) {
      setStore({ projects })
    }
  }),

  setProject: action((state, { project, notStore }) => {
    const fproject = state.projects.find((p) => p.url === project.url)
    if (!fproject) {
      state.projects.push(project)
    } else {
      Object.assign(fproject, project)
    }
    if (!notStore) {
      // proxy object can't serialize
      // https://stackoverflow.com/a/60344844
      const projects = state.projects.map((p) => omit(p, ['runningOutput', 'changes', 'isOpened']))
      setStore({ projects: clone(projects) })
    }
  }),
  removeProject: thunk((actions, id, { getState }) => {
    actions.closeProject(id)
    const projects = getState().projects.filter((p) => p.url !== id)
    actions.setProjects({ projects })
  }),

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
    if (!project) {
      frontProjectView()
      return
    }
    send('Status', { url: project.url, checkGit: false })
  }),

  openProject: thunk((actions, id, { getState }) => {
    const project = getState().projects.find((p) => p.url === id)
    if (!project) return

    send('Start', { url: project.url })
    project.isOpened = true
    actions.setFrontProject(project)
  }),
  startProject: action((state, id) => {
    const project = state.projects.find((p) => p.url === id)
    if (project) {
      send('Start', { url: project.url })
    } else if (state.frontProject) {
      send('Start', { url: state.frontProject.url })
    }
  }),
  stopProject: action((state, id) => {
    const project = state.projects.find((p) => p.url === id)
    if (project) {
      send('Stop', { url: project.url })
    } else if (state.frontProject) {
      send('Stop', { url: state.frontProject.url })
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
    actions.setProjects({ projects })
  }),

  load: thunk(async (actions) => {
    try {
      const projects = (await getStore('projects')) as Array<Project>
      if (projects) {
        actions.setProjects({ projects, notStore: true })
        projects.forEach((p: Project) => {
          send('Import', { url: p.url, path: p.path, branch: p.config?.branch })
        })
      }
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()
    statusUnlisten = listen('status', (payload: StatusPayload | PayloadError) => {
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
      project.stage = status.stage

      if (frontProject === project) {
        actions.setLoading(project.stage === ProjectStage.Starting)
        if (project.stage === ProjectStage.Running) {
          actions.setDebugging(false)
        }
      }

      project.changes = status.changes
      project.productName = status.productName
      project.tailwindVersion = status.tailwindVersion
      actions.setProject({ project })
    })

    startingUnlisten = listen('starting', (payload: ProcessPayload) => {
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

      if (payload.reset) {
        project.runningOutput = []
      } else if (payload.stdout) {
        project.runningOutput.push(`stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        project.runningOutput.push(`stderr:${payload.stderr}`)
      } else if (payload.exit !== undefined) {
        project.runningOutput.push(`exit:${payload.error}`)
      }
    })
  }),

  unlisten: action((state) => {
    if (statusUnlisten) statusUnlisten()
    if (startingUnlisten) startingUnlisten()
  }),

  modalDisclosure: false,
  setModalOpen: action((state) => {
    state.modalDisclosure = true
  }),
  setModalClose: action((state) => {
    state.modalDisclosure = false
  }),

  debugging: false,
  setDebugging: action((state, payload) => {
    state.debugging = payload
    if (payload) {
      frontProjectView()
    } else if (state.frontProject) {
      frontProjectView(clone(state.frontProject))
    }
  }),

  openStatus: false,
  setOpenStatus: action((state, payload) => {
    state.openStatus = payload
    if (payload) {
      frontProjectView()
    } else if (state.frontProject) {
      frontProjectView(clone(state.frontProject))
    }
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
