import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
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
  username: string
  password: string
  name: string
  isOpened?: boolean
  editedTime?: Date
}

export interface ProjectModel {
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; storage?: boolean }>
  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  openProject: Action<ProjectModel, string>
  closeProject: Action<ProjectModel, string>
  load: Thunk<ProjectModel>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel, any>
  setModalClose: Action<ProjectModel, any>
}

const projectModel: ProjectModel = {
  projects: [
    {
      name: 'Test1',
      username: 'asdasd',
      password: 'adzxczxc',
      url: 'czxcasd',
      isOpened: true,
      editedTime: dayjs().add(-2, 'hours').toDate(),
    },
    {
      name: 'Test2',
      username: 'asdasd',
      password: 'adzxczxc',
      url: 'czxcasd2',
      isOpened: true,
      editedTime: dayjs().add(-1, 'days').toDate(),
    },
  ],
  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  setProjects: action((state, { projects, storage }) => {
    state.projects = projects
    if (storage) {
      window.setStore({ projects })
    }
  }),
  addProject: action((state, project) => {
    if (state.projects.map((p) => p.url).includes(project.url)) {
      toast({
        title: 'Project already exists',
        status: 'warning',
      })
      return
    }
    state.projects.push(project)
    window.setStore({ projects: state.projects })
  }),
  removeProject: action((state, projectId) => {
    state.projects = state.projects.filter((p) => p.url !== projectId)
    window.setStore({ projects: state.projects })
  }),
  openProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.url === projectId)
    if (project) {
      project.isOpened = true
      state.frontProject = project
    }
  }),
  closeProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.url === projectId)
    if (!project) throw new Error('closeProject null')

    if (project.url === state.frontProject?.url) {
      // match chrome-tabs.js:243
      const oindex = state.openedProjects.findIndex((p) => p.url === project.url)
      if (oindex >= 0) {
        if (oindex + 1 < state.openedProjects.length) {
          state.frontProject = state.openedProjects[oindex + 1]
        } else if (oindex - 1 >= 0) {
          state.frontProject = state.openedProjects[oindex - 1]
        } else {
          state.frontProject = null
        }
      }
    }

    project.isOpened = false
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

  frontProject: null,
  setFrontProject: action((state, project) => {
    state.frontProject = project
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
