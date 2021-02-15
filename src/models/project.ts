import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
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
  path: string
  username: string
  password: string
  name: string
  isOpened?: boolean
  editedTime?: string
}

export interface ProjectModel {
  projects: Array<Project>
  openedProjects: Computed<ProjectModel, Array<Project>>
  setProjects: Action<ProjectModel, { projects: Array<Project>; storage?: boolean }>
  addProject: Action<ProjectModel, Project>
  removeProject: Thunk<ProjectModel, string>
  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string>
  load: Thunk<ProjectModel>

  frontProject: Project | null
  setFrontProject: Action<ProjectModel, Project | null>

  modalDisclosure: boolean
  setModalOpen: Action<ProjectModel>
  setModalClose: Action<ProjectModel>
}

const projectModel: ProjectModel = {
  projects: [
    {
      url: 'czxcasd',
      path: 'D:\\derealize-demo-temp',
      name: 'Test1',
      username: 'asdasd',
      password: 'adzxczxc',
      isOpened: true,
      editedTime: dayjs().add(-2, 'hours').toString(),
    },
    {
      url: 'czxcasd2',
      path: 'D:\\derealize-demo-temp',
      name: 'Test2',
      username: 'asdasd',
      password: 'adzxczxc',
      isOpened: true,
      editedTime: dayjs().add(-1, 'days').toString(),
    },
    {
      url: 'tryrty',
      path: 'D:\\derealize-demo-temp',
      name: 'Test3',
      username: 'fsdf',
      password: 'xcvsdfs',
      isOpened: true,
      editedTime: dayjs().add(-2, 'days').toString(),
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
  removeProject: thunk((actions, projectId, { getState }) => {
    actions.closeProject(projectId)
    const projects = getState().projects.filter((p) => p.url !== projectId)
    actions.setProjects({ projects, storage: true })
  }),
  openProject: thunk((actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.url === projectId)
    if (project) {
      project.isOpened = true
      actions.setFrontProject(project)
    }
  }),
  closeProject: thunk((actions, projectId, { getState }) => {
    const { projects, frontProject, openedProjects } = getState()
    const project = projects.find((p) => p.url === projectId)
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
    window.frontProjectView(project?.url || '')
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
