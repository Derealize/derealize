/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { nanoid } from 'nanoid'
import { Action, action, Thunk, thunk, Computed, computed, actionOn, ActionOn } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import type { TailwindConfig, Variant } from 'tailwindcss/tailwind-config'
import { Handler } from '../backend/backend.interface'
import type { StoreModel } from './index'
import { ElementPayload, ElementActualStatus, MainIpcChannel, ElementTag } from '../interface'
import type { Property } from './controlles/controlles'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendMainIpc, sendBackIpc, listenMainIpc, unlistenMainIpc } = window.derealize

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

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

export interface ElementState extends ElementPayload {
  selected: boolean
  propertys: Array<Property>
  actualStatus?: ElementActualStatus
  pending?: boolean
}

export interface ElementHistory extends ElementPayload {
  propertys: Array<Property>
}

export interface ElementModel {
  states: { [projectId: string]: { elements: Array<ElementState>; historys: Array<ElementHistory> } }
  activeElement: Computed<ElementModel, ElementState | undefined, StoreModel>
  activePendingElements: Computed<ElementModel, Array<ElementState>, StoreModel>
  activePropertys: Computed<ElementModel, Array<Property>, StoreModel>

  screenVariants: Computed<ElementState, Array<string>, StoreModel>
  customVariants: Computed<ElementState, Array<string>, StoreModel>

  unSelectedAllElements: Action<ElementModel, string>
  focusElement: Action<ElementModel, ElementPayload>
  respElementStatus: Action<ElementModel, ElementActualStatus>
  cleanElements: Action<ElementModel, string>
  savedElements: Action<ElementModel, string>

  droppedActiveElement: Action<ElementModel, ElementPayload>
  pushActiveElementProperty: Action<ElementModel, { projectId: string; property: Property }>
  setActiveElementPropertyValue: Action<ElementModel, { projectId: string; propertyId: string; classname: string }>
  setActiveElementText: Action<ElementModel, { projectId: string; text: string }>
  setActiveElementTag: Action<ElementModel, { projectId: string; tag: ElementTag }>
  deleteActiveElementProperty: Action<ElementModel, { projectId: string; propertyId: string }>

  listen: Thunk<ElementModel, void, void, StoreModel>
  unlisten: Action<ElementModel>

  onElementStateChange: ActionOn<ElementModel>
  revokeHistory: Action<ElementModel, string>
}

const elementModel: ElementModel = {
  states: {},
  activeElement: computed(
    [(state) => state.states, (state, storeState) => storeState.project.frontProject],
    (states, project) => states[project?.id || '']?.elements.find((el) => el.selected),
  ),
  activePendingElements: computed(
    [(state) => state.states, (state, storeState) => storeState.project.frontProject],
    (states, project) => states[project?.id || '']?.elements.filter((el) => el.pending) || [],
  ),
  activePropertys: computed((state) => {
    return state.activeElement?.propertys || []
  }),

  screenVariants: computed([(state, storeState) => storeState.project.frontProject], (frontProject) => {
    if (!frontProject?.tailwindConfig) return []
    return Object.keys(frontProject.tailwindConfig.theme.screens)
  }),

  customVariants: computed([(state, storeState) => storeState.project.frontProject], (frontProject) => {
    if (!frontProject?.tailwindConfig) return []
    let result: Array<string> = []
    for (const [name, variants] of Object.entries(frontProject.tailwindConfig.variants)) {
      const leftVariants = (variants as Variant[]).filter(
        (v) =>
          v !== 'responsive' && v !== 'dark' && !StateVariants.includes(v as any) && !ListVariants.includes(v as any),
      )
      result = result.concat(leftVariants)
    }
    return [...new Set(result)]
  }),

  unSelectedAllElements: action((state, projectId) => {
    state.states[projectId]?.elements.forEach((st) => {
      st.selected = false
    })
  }),
  focusElement: action((state, payload) => {
    const { projectId, codePosition, className } = payload

    const propertys: Array<Property> = []
    className.split(/\s+/).forEach((name) => {
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

    if (!state.states[projectId]) {
      state.states[projectId] = { elements: [], historys: [] }
    }

    state.states[projectId].elements.forEach((el) => {
      el.selected = false
    })

    const newState: ElementState = { ...payload, propertys, selected: true }
    const elementState = state.states[projectId].elements.find((el) => el.codePosition === codePosition)
    if (elementState) {
      Object.assign(elementState, newState)
    } else {
      state.states[projectId].elements.push(newState)
    }
  }),
  respElementStatus: action((state, status) => {
    const el = state.states[status.projectId]?.elements.find((e) => e.codePosition === status.codePosition)
    if (el) {
      el.actualStatus = status
    }
  }),
  cleanElements: action((state, projectId) => {
    state.states[projectId] = { elements: [], historys: [] }
  }),
  savedElements: action((state, projectId) => {
    if (!state.states[projectId]) return

    const payloads: Array<ElementPayload> = []
    state.states[projectId].elements
      .filter((el) => el.pending)
      .forEach((el) => {
        let className = ''
        el.propertys.forEach((property) => {
          const { screen, state: estate, list, custom, dark, classname: name } = property
          if (!name) return

          let variants = ''
          if (screen) {
            variants += `${screen}:`
          }
          if (estate) {
            variants += `${estate}:`
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

        const { selected, propertys, actualStatus, pending, ...payload } = el
        payload.className = className
        payloads.push(payload)
        if (selected) {
          el.pending = undefined
        }
      })

    sendBackIpc(Handler.ApplyElements, payloads as any)
    state.states[projectId].elements = state.states[projectId].elements.filter((el) => el.selected)
    state.states[projectId].historys = []
  }),

  droppedActiveElement: action((state, { projectId, codePosition, dropzoneCodePosition }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((st) => st.codePosition === codePosition)
    if (!element) return

    element.dropzoneCodePosition = dropzoneCodePosition
    element.pending = true
  }),

  pushActiveElementProperty: action((state, { projectId, property }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.pending = true
    element.propertys.push(property)
  }),
  setActiveElementPropertyValue: action((state, { projectId, propertyId, classname }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.pending = true
    const property = element.propertys.find((p) => p.id === propertyId)
    if (property) {
      property.classname = classname
    }
  }),
  setActiveElementText: action((state, { projectId, text }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.pending = true
    element.originalText = element.actualStatus?.text
    element.text = text
  }),
  setActiveElementTag: action((state, { projectId, tag }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.pending = true
    element.originalTagName = element.actualStatus?.tagName
    element.tagName = tag
  }),
  deleteActiveElementProperty: action((state, { projectId, propertyId }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.propertys = element.propertys.filter((p) => p.id !== propertyId)
  }),

  listen: thunk(async (actions, none, { getState, getStoreState }) => {
    actions.unlisten()

    listenMainIpc(MainIpcChannel.FocusElement, (event: IpcRendererEvent, element: ElementPayload) => {
      actions.focusElement(element)
    })

    listenMainIpc(MainIpcChannel.RespElementStatus, (event: IpcRendererEvent, status: ElementActualStatus) => {
      actions.respElementStatus(status)
    })

    listenMainIpc(MainIpcChannel.BlurElement, (event: IpcRendererEvent, projectId: string) => {
      actions.unSelectedAllElements(projectId)
    })

    listenMainIpc(MainIpcChannel.Refresh, (event: IpcRendererEvent, projectId: string) => {
      actions.cleanElements(projectId)
    })

    listenMainIpc(MainIpcChannel.ElementShortcut, (event: IpcRendererEvent, key: string, payload: any) => {
      const { frontProject } = getStoreState().project
      if (!frontProject) return

      if (key === 'Save') {
        actions.savedElements(frontProject.id)
      } else if (key === 'Delete') {
        if (getState().states[frontProject.id]?.elements.filter((el) => el.pending).length) {
          toast({
            title: 'Please save the existing modified element before delete the element',
            status: 'warning',
          })
          return
        }
        if (window.confirm('Sure Delete?')) {
          sendBackIpc(Handler.DeleteElement, { projectId: frontProject.id, codePosition: payload })
        }
      }
    })

    listenMainIpc(MainIpcChannel.Dropped, (event: IpcRendererEvent, payload: ElementPayload) => {
      const { frontProject } = getStoreState().project
      if (!frontProject) return

      if (getState().states[frontProject.id]?.elements.filter((el) => el.pending).length) {
        toast({
          title: 'Please save the existing modified element before dropped the element',
          status: 'warning',
        })
        return
      }

      actions.droppedActiveElement(payload)
    })
  }),

  unlisten: action(() => {
    unlistenMainIpc(MainIpcChannel.FocusElement)
    unlistenMainIpc(MainIpcChannel.RespElementStatus)
    unlistenMainIpc(MainIpcChannel.BlurElement)
    unlistenMainIpc(MainIpcChannel.ElementShortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
    unlistenMainIpc(MainIpcChannel.Dropped)
  }),

  onElementStateChange: actionOn(
    (actions) => [
      actions.droppedActiveElement,
      actions.pushActiveElementProperty,
      actions.setActiveElementPropertyValue,
      actions.setActiveElementText,
      actions.setActiveElementTag,
      actions.deleteActiveElementProperty,
    ],
    (state, target) => {
      const {
        type,
        resolvedTargets,
        payload: { projectId },
      } = target
      const states = state.states[projectId]
      if (!states) return

      const element = states.elements.find((el) => el.selected)
      if (!element) return
      const { selected, actualStatus, pending, ...payload } = element

      const [
        droppedActiveElement,
        pushActiveElementProperty,
        setActiveElementPropertyValue,
        setActiveElementText,
        setActiveElementTag,
        deleteActiveElementProperty,
      ] = resolvedTargets

      switch (type) {
        case pushActiveElementProperty:
        case setActiveElementPropertyValue:
          states.historys.push(payload)
          break
        case setActiveElementText:
          break
        default:
          break
      }
    },
  ),

  revokeHistory: action((state, projectId) => {
    const historys = state.states[projectId]?.historys
    if (!historys || !historys.length) return

    const popHistory = historys.pop()
    // const { text, tagName } = popHistory
    // if (text !== undefined) {
    //   sendMainIpc(MainIpcChannel.LiveUpdateText, projectId, text)
    // }
    const lastHistory = historys[historys.length - 1]

    const payloads = lastHistory.map((h) => {
      h.className = ''
      h.propertys.forEach((property) => {
        const { screen, state: estate, list, custom, dark, classname: name } = property
        if (!name) return

        let variants = ''
        if (screen) {
          variants += `${screen}:`
        }
        if (estate) {
          variants += `${estate}:`
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
        h.className += `${variants + name} `
      })
      const { propertys, ...payload } = h
      return payload
    })
    sendMainIpc(MainIpcChannel.Revoke, projectId, payloads)
  }),
}

export default elementModel
