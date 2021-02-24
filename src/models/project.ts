import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ProjectStage, GitFileChanges, ProcessPayload, StatusPayload } from '../backend/project.interface'
import { send, listen } from '../ipc'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

let statusUnlisten: any
let runningUnlisten: any

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

export interface Project {
  url: string
  path: string
  editedTime: string
  name: string
  productName?: string
  lunchUrl?: string
  isOpened?: boolean
  stage?: ProjectStage
  tailwindVersion?: string
  changes?: Array<GitFileChanges>
  runningOutput: Array<string>
}

export interface ProjectModel {
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; notStore?: boolean }>

  setProject: Action<ProjectModel, { project: Project; notStore?: boolean }>
  removeProject: Thunk<ProjectModel, string>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  load: Thunk<ProjectModel>
  listen: Thunk<ProjectModel>
  unlisten: Action<ProjectModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>
}

const projectModel: ProjectModel = {
  projects: [],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  setProjects: action((state, { projects, notStore }) => {
    state.projects = projects
    if (!notStore) {
      window.setStore({ projects })
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
      // https://stackoverflow.com/q/53102700/346701
      window.setStore({ projects: state.projects.map((p) => p) })
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
    window.frontProjectView(project?.url, project?.lunchUrl)
    if (project) {
      send('Status', { url: project.url })
    }
  }),

  openProject: thunk((actions, id, { getState }) => {
    const project = getState().projects.find((p) => p.url === id)
    if (!project) return

    send('Start', { url: project.url })
    project.isOpened = true
    actions.setFrontProject(project)
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

    send('Dispose', { url: project.url })
    window.closeProjectView(project.url)
    actions.setProjects({ projects })
  }),

  load: thunk(async (actions) => {
    try {
      const projects = await window.getStore('projects')
      if (projects) actions.setProjects({ projects, notStore: true })
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()
    statusUnlisten = listen('status', (payload: StatusPayload) => {
      if (payload.error) {
        toast({
          title: `Status error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.url === payload.id)
      if (!project) return
      project.changes = payload.changes
      project.stage = payload.stage
      project.productName = payload.productName
      project.tailwindVersion = payload.tailwindVersion
      actions.setProject({ project })
    })

    runningUnlisten = listen('running', (payload: ProcessPayload) => {
      if (payload.error) {
        toast({
          title: `Running error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.url === payload.id)
      if (!project) return

      if (payload.reset) {
        project.runningOutput = []
        return
      }

      if (payload.stdout) {
        project.runningOutput.push(`running stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        project.runningOutput.push(`running stderr:${payload.stderr}`)
      } else if (payload.error) {
        project.runningOutput.push(`running error:${payload.error}`)
      } else if (payload.exit !== undefined) {
        project.runningOutput.push(`exit:${payload.error}`)
      }
    })
  }),

  unlisten: action((state) => {
    if (statusUnlisten) statusUnlisten()
    if (runningUnlisten) runningUnlisten()
  }),

  modalDisclosure: false,
  setModalOpen: action((state) => {
    state.modalDisclosure = true
  }),
  setModalClose: action((state) => {
    state.modalDisclosure = false
  }),
}

export default projectModel
