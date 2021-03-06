/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast, AlertStatus } from '@chakra-ui/react'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import { nanoid } from 'nanoid'
import type { StoreModel } from './index'
import type { StatusPayload, PayloadError, BoolReply } from '../backend/backend.interface'
import { Broadcast, Handler } from '../backend/backend.interface'
import { ProjectView, Project, BackgroundImage, Colors } from './project.interface'
import { MainIpcChannel, ImportPayload } from '../interface'
import storeProject from '../services/storeProject'
import { CssUrlReg } from '../utils/assest'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendBackIpc, listenBackIpc, unlistenBackIpc, listenMainIpc, unlistenMainIpc, sendMainIpc, sendMainIpcSync } =
  window.derealize

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

const decideProjectView = (project?: Project) => {
  if (!project) {
    sendMainIpc(MainIpcChannel.FrontView)
    return
  }
  if (!project.isFront) return
  if (project.view === ProjectView.BrowserView) {
    if (!project.config) throw new Error('project.config null')
    sendMainIpc(
      MainIpcChannel.FrontView,
      project.id,
      project.config.baseUrl,
      [...project.config.pages],
      project.config.isWeapp,
    )
  } else {
    sendMainIpc(MainIpcChannel.FrontView)
  }
}

export interface ProjectModel {
  projects: Array<Project>
  setProjects: Action<ProjectModel, Array<Project>>

  editingProject: Computed<ProjectModel, Project | undefined>
  setEditingProject: Action<ProjectModel, string | null>
  editProject: Action<ProjectModel, { displayname: string }>

  openedProjects: Computed<ProjectModel, Array<Project>>
  frontProject: Computed<ProjectModel, Project | undefined>

  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  removeProjectThunk: Thunk<ProjectModel, string>

  setProjectView: Action<ProjectModel, { projectId: string; view: ProjectView }>
  setProjectViewHistory: Action<ProjectModel, { projectId: string; isView: boolean }>
  setTailwindConfig: Action<ProjectModel, { projectId: string; config: TailwindConfig }>
  setProjectFavicon: Action<ProjectModel, { projectId: string; favicon: string }>

  flushProject: Action<ProjectModel, string>
  setFrontProject: Action<ProjectModel, string | null>

  openProject: Thunk<ProjectModel, string>
  closeProject: Action<ProjectModel, string>
  closeProjectThunk: Thunk<ProjectModel, string | undefined>

  setProjectStatus: Action<ProjectModel, StatusPayload>
  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel, void, void, StoreModel>
  unlisten: Action<ProjectModel>

  importModalProjectId: string | undefined
  toggleImportModal: Action<ProjectModel, boolean>

  imagesModalDisclosure: boolean
  toggleImagesModal: Action<ProjectModel, boolean | undefined>
  modalImages: Computed<ProjectModel, BackgroundImage[]>

  colorsModalShow: boolean
  colorsModalData: { colors: Colors; theme: string } | undefined
  colorsModalToggle: Action<ProjectModel, { show: boolean; colors?: Colors; theme?: string }>

  setJitClassName: Action<ProjectModel, { projectId: string; className: string }>

  isDisableLink: boolean
  setIsDisableLink: Action<ProjectModel, boolean>
}

const projectModel: ProjectModel = {
  projects: [],
  setProjects: action((state, projects) => {
    state.projects = [...projects]
    storeProject(state.projects)
  }),

  editingProject: computed((state) => {
    return state.projects.find((p) => p.isEditing)
  }),
  setEditingProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isEditing = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isEditing = true
      decideProjectView(undefined)
    } else {
      decideProjectView(state.frontProject)
    }
  }),
  editProject: action((state, { displayname }) => {
    const project = state.projects.find((p) => p.isEditing)
    if (!project) return

    project.name = displayname
    storeProject(state.projects)
  }),

  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  frontProject: computed((state) => {
    return state.projects.find((p) => p.isFront)
  }),
  addProject: action((state, project) => {
    if (state.projects.some((p) => p.id === project.id)) {
      throw Error('projectId already exist.')
    }

    state.projects.push(project)
    storeProject(state.projects)
  }),
  removeProject: action((state, projectId) => {
    state.projects = state.projects.filter((p) => p.id !== projectId)
    storeProject(state.projects)
    sendBackIpc(Handler.Remove, { projectId })
  }),
  removeProjectThunk: thunk((actions, projectId) => {
    actions.closeProjectThunk(projectId)
    actions.removeProject(projectId)
  }),

  setProjectView: action((state, { projectId, view }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.view = view
    decideProjectView(project)
  }),
  setProjectViewHistory: action((state, { projectId, isView }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.viewHistory = isView
    if (isView) {
      project.view = ProjectView.BrowserView
      decideProjectView(project)
    }
  }),
  setTailwindConfig: action((state, { projectId, config }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.tailwindConfig = config
  }),
  setProjectFavicon: action((state, { projectId, favicon }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.favicon = favicon
  }),

  flushProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      sendBackIpc(Handler.Flush, { projectId: project.id })
    }
  }),
  setFrontProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isFront = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isFront = true
      project.isOpened = true
      sendBackIpc(Handler.Flush, { projectId: project.id })
      sendMainIpc(MainIpcChannel.DisableLink, project.id, state.isDisableLink)
    }
    decideProjectView(project)
  }),

  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return

    project.view = ProjectView.BrowserView
    actions.setFrontProject(project.id)
    sendMainIpc(MainIpcChannel.LoadURL, project.id, '')
  }),
  closeProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = false
  }),
  closeProjectThunk: thunk((actions, projectId, { getState }) => {
    const { projects, openedProjects, frontProject } = getState()

    const project = projectId ? projects.find((p) => p.id === projectId) : frontProject
    if (!project) {
      throw new Error('closeProject null')
    }

    actions.closeProject(project.id)
    sendMainIpc(MainIpcChannel.DestroyProjectView, projectId)

    if (project.isFront) {
      // match chrome-tabs.js:243
      const oindex = openedProjects.findIndex((p) => p.id === project.id)
      if (oindex >= 0) {
        if (oindex + 1 < openedProjects.length) {
          actions.setFrontProject(openedProjects[oindex + 1].id)
        } else if (oindex - 1 >= 0) {
          actions.setFrontProject(openedProjects[oindex - 1].id)
        } else {
          actions.setFrontProject(null)
        }
      }
    }
  }),

  loadStore: thunk(async (actions) => {
    const projects = sendMainIpcSync(MainIpcChannel.GetStore, 'projects') as Array<Project> | undefined
    if (!projects) return

    actions.setProjects(projects)
    await Promise.all(
      projects.map(async (project) => {
        const { id: projectId, path } = project

        const payload: ImportPayload = { projectId, path }
        const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
        if (!result) {
          toast({
            title: `Import error: ${error}`,
            status: 'error',
          })
        }
      }),
    )
  }),

  setProjectStatus: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.projectId)
    if (!project) return

    project.config = payload.config
    project.tailwindVersion = payload.tailwindVersion
    project.tailwindConfig = payload.tailwindConfig
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

      actions.setProjectStatus(payload as StatusPayload)
    })

    listenMainIpc(MainIpcChannel.Shortcut, (event: IpcRendererEvent, key: string) => {
      const { frontProject, colorsModalShow } = getState()
      if (!frontProject) return

      if (key === 'Image Manager') {
        actions.toggleImagesModal(undefined)
      } else if (key === 'Colors Manager') {
        actions.colorsModalToggle({ show: !colorsModalShow })
      } else if (key === 'Undo') {
        getStoreActions().element.revokeHistory(frontProject.id)
      } else if (key === 'Redo') {
        getStoreActions().element.redoHistory(frontProject.id)
      } else if (key === 'History') {
        actions.setProjectViewHistory({ projectId: frontProject.id, isView: !frontProject.viewHistory })
      }
    })

    listenMainIpc(MainIpcChannel.CloseFrontProject, (event: IpcRendererEvent) => {
      actions.closeProjectThunk()
    })

    listenMainIpc(MainIpcChannel.Flush, (event: IpcRendererEvent, projectId: string) => {
      actions.flushProject(projectId)
    })

    listenMainIpc(MainIpcChannel.LoadStart, (event: IpcRendererEvent, projectId: string) => {
      actions.setProjectView({ projectId, view: ProjectView.Loading })
    })

    listenMainIpc(MainIpcChannel.LoadFinish, (event: IpcRendererEvent, projectId: string, ok: boolean) => {
      actions.setProjectView({ projectId, view: ok ? ProjectView.BrowserView : ProjectView.LoadFail })
      if (!ok) actions.setProjectViewHistory({ projectId, isView: false })
    })

    listenMainIpc(MainIpcChannel.Favicon, (event: IpcRendererEvent, projectId: string, favicon: string) => {
      actions.setProjectFavicon({ projectId, favicon })
    })

    listenMainIpc(MainIpcChannel.Toast, (event: IpcRendererEvent, title: string, status: AlertStatus) => {
      toast({ title, status })
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenMainIpc(MainIpcChannel.Shortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
    unlistenMainIpc(MainIpcChannel.Flush)
    unlistenMainIpc(MainIpcChannel.LoadStart)
    unlistenMainIpc(MainIpcChannel.LoadFinish)
    unlistenMainIpc(MainIpcChannel.Favicon)
    unlistenMainIpc(MainIpcChannel.Toast)
  }),

  importModalProjectId: undefined,
  toggleImportModal: action((state, open) => {
    if (open) {
      state.importModalProjectId = nanoid()
      decideProjectView(undefined)
    } else {
      state.importModalProjectId = undefined
      decideProjectView(state.frontProject)
    }
  }),

  imagesModalDisclosure: false,
  toggleImagesModal: action((state, open) => {
    if (open === false || state.imagesModalDisclosure) {
      decideProjectView(state.frontProject)
      state.imagesModalDisclosure = false
    } else {
      decideProjectView(undefined)
      state.imagesModalDisclosure = true
    }
  }),
  modalImages: computed((state) => {
    if (!state.frontProject?.tailwindConfig?.theme.backgroundImage) return []
    const images: Array<BackgroundImage> = []
    for (const [name, value] of Object.entries(state.frontProject.tailwindConfig.theme.backgroundImage)) {
      const regValues = CssUrlReg.exec(value)
      if (regValues && regValues.length > 1) {
        images.push({
          name,
          webPath: regValues[1],
        })
      }
    }
    return images
  }),

  colorsModalShow: false,
  colorsModalData: undefined,
  colorsModalToggle: action((state, { show, colors, theme }) => {
    if (show) {
      decideProjectView(undefined)
      state.colorsModalShow = true
      if (colors && theme) {
        state.colorsModalData = { colors, theme }
      }
    } else {
      decideProjectView(state.frontProject)
      state.colorsModalShow = false
      state.colorsModalData = undefined
    }
  }),

  setJitClassName: action((state, { projectId, className }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.jitClassName = className
    }
  }),

  isDisableLink: false,
  setIsDisableLink: action((state, isDisable) => {
    state.isDisableLink = isDisable
  }),
}

export default projectModel
