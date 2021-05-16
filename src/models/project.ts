/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { nanoid } from 'nanoid'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import omit from 'lodash.omit'
import type { TailwindConfig, Variant } from 'tailwindcss/tailwind-config'
import type { StoreModel } from './index'
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
import { Broadcast, Handler, ProjectStatus } from '../backend/backend.interface'
import { ElementPayload, ElementActualStatus, MainIpcChannel, ImportPayload } from '../interface'
import type { Property } from './controlles/controlles'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendBackIpc, listenBackIpc, unlistenBackIpc, listenMainIpc, unlistenMainIpc, sendMainIpc, sendMainIpcSync } =
  window.derealize

// export type Element = Omit<ElementPayload, 'projectId'>

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
  Elements,
}

export interface ElementState extends ElementPayload {
  selected: boolean
  propertys: Array<Property>
  actualStatus?: ElementActualStatus
  pending?: boolean
}

export interface Project {
  id: string
  url: string
  path: string
  editedTime: string
  name: string
  branch: string
  isOpened?: boolean
  isFront?: boolean
  isEditing?: boolean
  status?: ProjectStatus
  tailwindConfig?: TailwindConfig
  tailwindVersion?: string
  config?: ProjectConfig
  changes?: Array<GitFileChanges>
  elements?: Array<ElementState>
  view?: ProjectView
  startloading?: boolean
  runningOutput?: Array<string>
  jitClassName?: string
}

// 这些variant类型切分后各自单选，只是遵循设计经验。两个variant必须同时达成相应条件才能激活样式，hover与focus是不太可能同时存在的
// 本质上所有variant都可以多选应用在同一个属性上
export const StateVariants = [
  'hover',
  'focus',
  'active',
  'disabled',
  'visited',
  'checked',
  'group-hover', // 需要父元素设置 'group' class
  'group-focus',
  'focus-within',
  'focus-visible',
] as const
export type StateVariantsType = typeof StateVariants[number]

export const ListVariants = ['first', 'last', 'odd', 'even'] as const
export type ListVariantsType = typeof ListVariants[number]

export const OmitStoreProp = [
  'isOpened',
  'isFront',
  'isEditing',
  'status',
  'stage',
  'changes',
  'runningOutput',
  'installOutput',
  'config',
  'tailwindConfig',
  'elements',
  'view',
  'startloading',
  'jitClassName',
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
  sendMainIpc(MainIpcChannel.SetStore, { projects: clone(omitProjects) })
}

const mainFrontView = (project?: Project) => {
  if (project?.view === ProjectView.BrowserView) {
    if (!project.config) throw new Error('project.config null')
    sendMainIpc(
      MainIpcChannel.FrontView,
      project.id,
      project.config.lunchUrl,
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

  openedProjects: Computed<ProjectModel, Array<Project>>
  frontProject: Computed<ProjectModel, Project | undefined>
  isReady: Computed<ProjectModel, (id: string) => boolean | undefined>
  activeElement: Computed<ProjectModel, ElementState | undefined>

  addProject: Action<ProjectModel, Project>
  removeProject: Action<ProjectModel, string>
  removeProjectThunk: Thunk<ProjectModel, string>

  pushRunningOutput: Action<ProjectModel, { projectId: string; output: string }>
  emptyRunningOutput: Action<ProjectModel, string>
  setStartLoading: Action<ProjectModel, { projectId: string; loading: boolean }>
  setProjectView: Action<ProjectModel, { projectId: string; view: ProjectView }>

  screenVariants: Computed<ProjectModel, Array<string>, StoreModel>
  customVariants: Computed<ProjectModel, Array<string>, StoreModel>

  unSelectedAllElements: Action<ProjectModel, string>
  focusElement: Action<ProjectModel, { projectId: string; element: ElementPayload }>
  respElementStatus: Action<ProjectModel, { projectId: string; status: ElementActualStatus }>
  cleanElements: Action<ProjectModel, string>
  savedElements: Action<ProjectModel, string>

  setActiveElementProperty: Action<ProjectModel, Property>
  deleteActiveElementProperty: Action<ProjectModel, string>
  shiftClassName: Thunk<ProjectModel, boolean | undefined, void, StoreModel>

  setFrontProject: Action<ProjectModel, string | null>
  startProject: Thunk<ProjectModel, string>
  stopProject: Action<ProjectModel, string>

  toggleProject: Action<ProjectModel, { projectId: string; open: boolean }>
  openProject: Thunk<ProjectModel, string>
  closeProject: Thunk<ProjectModel, string | undefined>

  setProjectStatue: Action<ProjectModel, StatusPayload>
  loadStore: Thunk<ProjectModel>
  listen: Thunk<ProjectModel, void, void, StoreModel>
  unlisten: Action<ProjectModel>

  importModalDisclosure: boolean
  toggleImportModal: Action<ProjectModel, boolean | undefined>

  historys: Array<CommitLog>
  setHistorys: Action<ProjectModel, Array<CommitLog>>
  callHistory: Thunk<ProjectModel>

  setJitClassName: Action<ProjectModel, { projectId: string; className: string }>
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
      mainFrontView(undefined)
    } else {
      mainFrontView(state.frontProject)
    }
  }),

  openedProjects: computed((state) => {
    return state.projects.filter((p) => p.isOpened)
  }),
  frontProject: computed((state) => {
    return state.projects.find((p) => p.isFront)
  }),
  isReady: computed((state) => (id) => {
    return state.projects.find((p) => p.id === id)?.status === ProjectStatus.Ready
  }),
  activeElement: computed((state) => {
    return state.frontProject?.elements?.find((el) => el.selected)
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
    actions.closeProject(projectId)
    actions.removeProject(projectId)
  }),

  pushRunningOutput: action((state, { projectId, output }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      if (!project.runningOutput) project.runningOutput = []
      project.runningOutput.push(output)
    }
  }),
  emptyRunningOutput: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.runningOutput = []
    }
  }),

  setStartLoading: action((state, { projectId, loading }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.startloading = loading
    }
  }),
  setProjectView: action((state, { projectId, view }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.view = view
    if (project.id === state.frontProject?.id) {
      mainFrontView(project)
    }
  }),

  screenVariants: computed((state) => {
    if (!state.frontProject?.tailwindConfig) return []
    return Object.keys(state.frontProject.tailwindConfig.theme.screens)
  }),

  customVariants: computed((state) => {
    if (!state.frontProject?.tailwindConfig) return []
    let result: Array<string> = []
    for (const [name, variants] of Object.entries(state.frontProject.tailwindConfig.variants)) {
      const leftVariants = (variants as Variant[]).filter(
        (v) =>
          v !== 'responsive' && v !== 'dark' && !StateVariants.includes(v as any) && !ListVariants.includes(v as any),
      )
      result = result.concat(leftVariants)
    }
    return [...new Set(result)]
  }),

  unSelectedAllElements: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    project?.elements?.forEach((el) => {
      el.selected = false
    })
  }),
  focusElement: action((state, { projectId, element }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return

    project.elements?.forEach((el) => {
      el.selected = false
    })

    const propertys: Array<Property> = []
    if (element?.className) {
      element.className.split(/\s+/).forEach((name) => {
        const names = name.split(':')
        const property: Property = {
          id: nanoid(),
          classname: names.splice(-1)[0],
        }
        names.forEach((variant) => {
          if (state.screenVariants.includes(variant)) {
            property.screen = variant
          }
          if (StateVariants.includes(variant as StateVariantsType)) {
            property.state = variant as StateVariantsType
          }
          if (ListVariants.includes(variant as ListVariantsType)) {
            property.list = variant as ListVariantsType
          }
          if (state.customVariants.includes(variant)) {
            property.custom = variant
          }
          if (variant === 'dark') {
            property.dark = true
          }
        })
        propertys.push(property)
      })
    }

    const elstate = { ...element, propertys, selected: true }

    const el = project.elements?.find((e) => e.codePosition === element.codePosition)
    if (el) {
      Object.assign(el, elstate)
    } else {
      if (!project.elements) project.elements = []
      project.elements?.push(elstate)
    }
  }),
  respElementStatus: action((state, { projectId, status }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    const el = project.elements?.find((e) => e.codePosition === status.codePosition)
    if (el) {
      el.actualStatus = status
    }
  }),
  cleanElements: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.elements = []
  }),
  savedElements: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.elements = project.elements?.filter((el) => el.selected)
    project.elements?.forEach((el) => {
      el.pending = undefined
    })
  }),

  setActiveElementProperty: action((state, property) => {
    const project = state.projects.find((p) => p.isFront)
    if (!project) return
    const element = project.elements?.find((el) => el.selected)
    if (!element) return
    element.pending = true
    const target = element.propertys.find((p) => p.id === property.id)
    if (target) {
      Object.assign(target, property)
    } else {
      element.propertys.push(property)
    }
  }),
  deleteActiveElementProperty: action((state, propertyId) => {
    const project = state.projects.find((p) => p.isFront)
    if (!project) return
    const element = project.elements?.find((el) => el.selected)
    if (!element) return
    element.propertys = element.propertys.filter((p) => p.id !== propertyId)
  }),
  shiftClassName: thunk(async (actions, none, { getState }) => {
    const { frontProject } = getState()
    if (!frontProject || !frontProject.elements) return

    const payloads: Array<ElementPayload> = []
    frontProject.elements.forEach((element) => {
      let className = ''
      element.propertys.forEach((property) => {
        const { screen, state, list, custom, dark, classname: name } = property
        if (!name) return

        let variants = ''
        if (screen) {
          variants += `${screen}:`
        }
        if (state) {
          variants += `${state}:`
        }
        if (list) {
          variants += `${list}:`
        }
        if (custom) {
          variants += `${custom}:`
        }
        if (dark) {
          variants += `dark:`
        }
        className += `${variants + name} `
      })

      const { selected, propertys, ...payload } = element
      payload.className = className
      payloads.push(payload)
    })

    await sendBackIpc(Handler.ApplyElementsClassName, payloads as any)
    actions.savedElements(frontProject.id)
  }),

  setFrontProject: action((state, projectId) => {
    state.projects.forEach((p) => {
      p.isFront = false
    })

    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.isFront = true
      sendBackIpc(Handler.CheckStatus, { projectId: project.id })
    }
    mainFrontView(project)
  }),

  startProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return

    actions.emptyRunningOutput(projectId)
    actions.setStartLoading({ projectId, loading: true })
    actions.setProjectView({ projectId, view: ProjectView.Debugging })
    const reply = (await sendBackIpc(Handler.Start, { projectId })) as BoolReply
    if (!reply.result) {
      actions.setStartLoading({ projectId, loading: false })
      toast({
        title: reply.error,
        status: 'error',
      })
    }
  }),
  stopProject: action((state, projectId) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      sendBackIpc(Handler.Stop, { projectId })
    }
  }),

  toggleProject: action((state, { projectId, open }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (!project) return
    project.isOpened = open
    if (!open) {
      project.elements = []
    }
  }),
  openProject: thunk(async (actions, projectId, { getState }) => {
    const project = getState().projects.find((p) => p.id === projectId)
    if (!project) return
    actions.toggleProject({ projectId, open: true })
    await actions.setFrontProject(project.id)
    await actions.startProject(project.id)
  }),
  closeProject: thunk((actions, projectId, { getState }) => {
    const { projects, openedProjects, frontProject } = getState()

    const project = projectId ? projects.find((p) => p.id === projectId) : frontProject
    if (!project) {
      throw new Error('closeProject null')
    }

    actions.toggleProject({ projectId: project.id, open: false })
    sendBackIpc(Handler.Stop, { projectId })
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

    await Promise.all(
      projects.map(async (project) => {
        const { id: projectId, url, path, branch } = project

        const payload: ImportPayload = { projectId, url, path, branch }
        const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
        if (result) {
          sendBackIpc(Handler.Install, { projectId })
          project.tailwindConfig = (await sendBackIpc(Handler.GetTailwindConfig, { projectId })) as TailwindConfig
        } else {
          toast({
            title: `Import error: ${error}`,
            status: 'error',
          })
        }
      }),
    )

    actions.setProjects(projects)
  }),

  setProjectStatue: action((state, payload) => {
    const project = state.projects.find((p) => p.id === payload.projectId)
    if (!project) return

    project.config = payload.config

    if (payload.status === ProjectStatus.Running && project.status !== ProjectStatus.Running) {
      project.startloading = false
      project.view = ProjectView.BrowserView
      mainFrontView(project)
      sendMainIpc(MainIpcChannel.LoadURL, project.id, '')
    }

    project.status = payload.status
    project.changes = payload.changes
    project.tailwindVersion = payload.tailwindVersion
    storeProject(state.projects)
  }),

  listen: thunk(async (actions, none, { getState }) => {
    actions.unlisten()

    listenBackIpc(Broadcast.Status, (payload: StatusPayload | PayloadError) => {
      if ((payload as PayloadError).error) {
        toast({
          title: `Status error:${(payload as PayloadError).error}`,
          status: 'error',
        })
        return
      }

      actions.setProjectStatue(payload as StatusPayload)
    })

    listenBackIpc(Broadcast.Starting, (payload: ProcessPayload) => {
      if (payload.error) {
        actions.setStartLoading({ projectId: payload.projectId, loading: false })
        toast({
          title: `Starting error:${payload.error}`,
          status: 'error',
        })
        return
      }

      const { projects } = getState()
      const project = projects.find((p) => p.id === payload.projectId)
      if (!project) return

      const { id: projectId } = project

      if (payload.stdout) {
        actions.pushRunningOutput({ projectId, output: `stdout: ${payload.stdout}` })
      } else if (payload.stderr) {
        actions.pushRunningOutput({ projectId, output: `stderr: ${payload.stderr}` })
      } else if (payload.exit !== undefined) {
        actions.pushRunningOutput({ projectId, output: `exit: ${payload.error}` })
        actions.setStartLoading({ projectId, loading: false })
      }
    })

    listenMainIpc(MainIpcChannel.FocusElement, (event: IpcRendererEvent, element: ElementPayload) => {
      const project = getState().projects.find((p) => p.id === element.projectId)
      if (project) {
        actions.focusElement({ projectId: project.id, element })
      }
    })

    listenMainIpc(MainIpcChannel.RespElementStatus, (event: IpcRendererEvent, status: ElementActualStatus) => {
      const project = getState().projects.find((p) => p.id === status.projectId)
      if (project) {
        actions.respElementStatus({ projectId: project.id, status })
      }
    })

    listenMainIpc(MainIpcChannel.BlurElement, (event: IpcRendererEvent, projectId: string) => {
      const project = getState().projects.find((p) => p.id === projectId)
      if (project) {
        actions.unSelectedAllElements(project.id)
      }
    })

    listenMainIpc(MainIpcChannel.Flush, (event: IpcRendererEvent, projectId: string) => {
      const project = getState().projects.find((p) => p.id === projectId)
      if (project) {
        actions.cleanElements(project.id)
      }
    })

    listenMainIpc(MainIpcChannel.Shortcut, (event: IpcRendererEvent, key: string) => {
      if (key === 'Save') {
        actions.shiftClassName()
      }
    })

    listenMainIpc(MainIpcChannel.CloseFrontProject, (event: IpcRendererEvent) => {
      actions.closeProject()
    })
  }),

  unlisten: action(() => {
    unlistenBackIpc(Broadcast.Status)
    unlistenBackIpc(Broadcast.Starting)
    unlistenMainIpc(MainIpcChannel.FocusElement)
    unlistenMainIpc(MainIpcChannel.RespElementStatus)
    unlistenMainIpc(MainIpcChannel.BlurElement)
    unlistenMainIpc(MainIpcChannel.Flush)
    unlistenMainIpc(MainIpcChannel.Shortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
  }),

  importModalDisclosure: false,
  toggleImportModal: action((state, open) => {
    if (open === false || state.importModalDisclosure) {
      mainFrontView(state.frontProject)
      state.importModalDisclosure = false
    } else {
      mainFrontView(undefined)
      state.importModalDisclosure = true
    }
  }),

  historys: [],
  setHistorys: action((state, payload) => {
    state.historys = payload
  }),

  callHistory: thunk(async (actions, none, { getState }) => {
    actions.setHistorys([])

    const { frontProject } = getState()
    if (!frontProject) return

    const reply = (await sendBackIpc(Handler.History, { projectId: frontProject.id })) as HistoryReply
    if (reply.error) {
      toast({
        title: `callHistory error: ${reply.error}`,
        status: 'error',
      })
    } else {
      actions.setHistorys(reply.result)
    }
  }),

  setJitClassName: action((state, { projectId, className }) => {
    const project = state.projects.find((p) => p.id === projectId)
    if (project) {
      project.jitClassName = className
    }
  }),
}

export default projectModel
