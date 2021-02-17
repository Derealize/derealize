import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ProjectStage, GitFileChanges, Payload, StatusPayload } from '../backend/project.interface'
import { send, listen } from '../ipc'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

export interface Project {
  url: string
  displayName: string
  isOpened?: boolean
  editedTime?: string
  changes?: Array<GitFileChanges>
  stage?: ProjectStage
  tailwindVersion?: string
}

export interface ProjectModel {
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; storage?: boolean }>

  setProject: Action<ProjectModel, { project: Project; storage?: boolean }>
  removeProject: Thunk<ProjectModel, string>

  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  load: Thunk<ProjectModel>
  listen: Thunk<ProjectModel>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>
}

const projectModel: ProjectModel = {
  projects: [],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  setProjects: action((state, { projects, storage }) => {
    state.projects = projects
    if (storage) {
      window.setStore({ projects })
    }
  }),

  setProject: action((state, { project, storage }) => {
    const fproject = state.projects.find((p) => p.url === project.url)
    if (!fproject) {
      state.projects.push(project)
    } else {
      Object.assign(fproject, project)
    }
    if (storage) {
      // proxy object can't serialize
      // https://stackoverflow.com/q/53102700/346701
      window.setStore({ projects: state.projects.map((p) => p) })
    }
  }),
  removeProject: thunk((actions, id, { getState }) => {
    actions.closeProject(id)
    const projects = getState().projects.filter((p) => p.url !== id)
    actions.setProjects({ projects, storage: true })
  }),

  openProject: thunk((actions, id, { getState }) => {
    const project = getState().projects.find((p) => p.url === id)
    if (!project) return

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
    actions.setProjects({ projects, storage: true })
  }),

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
    window.frontProjectView(project?.url || '')
    if (project) {
      send('CheckStatus', { url: project.url })
    }
  }),

  load: thunk(async (actions) => {
    try {
      const projects = await window.getStore('projects')
      if (projects) actions.setProjects({ projects })
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }),

  listen: thunk(async (actions, none, { getState }) => {
    const unlisten = listen('checkStatus', (payload: StatusPayload) => {
      if (payload.error) {
        toast({
          title: `fileStatus error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.url === payload.id)
      if (!project) return
      project.changes = payload.changes
      project.stage = payload.stage
      project.tailwindVersion = payload.tailwindVersion
      actions.setProject({ project, storage: true })
    })
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
