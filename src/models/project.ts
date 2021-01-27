import { Action, action, Thunk, thunk } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import PreloadWindow from '../preload_window'

declare let window: PreloadWindow
const toast = createStandaloneToast()

export interface Project {
  url: string
  username: string
  password: string
}

export interface ProjectModel {
  projects: Array<Project>
  setProjects: Action<ProjectModel, { projects: Array<Project>; storage?: boolean }>
  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  loadProject: Thunk<ProjectModel>
}

const projectModel: ProjectModel = {
  projects: [],
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
        isClosable: true,
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
      actions.setProjects({ projects })
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
      })
    }
  }),
}

export default projectModel
