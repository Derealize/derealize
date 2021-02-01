import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
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
}

export interface ProjectModel {
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; storage?: boolean }>
  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  loadProject: Thunk<ProjectModel>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>
}

const projectModel: ProjectModel = {
  projects: [
    {
      name: 'Test1',
      username: 'asdasd',
      password: 'adzxczxc',
      url: 'czxcasd',
      isOpened: true,
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
  loadProject: thunk(async (actions) => {
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
}

export default projectModel
