/* eslint-disable no-restricted-syntax */
import type { IpcRendererEvent } from 'electron'
import { nanoid } from 'nanoid'
import clone from 'lodash.clonedeep'
import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import type { TailwindConfig, Variant } from 'tailwindcss/tailwind-config'
import { propertysTransClassName, storeStateProject } from '../utils/store-assest'
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

export const StateVariants = [
  'hover',
  'focus',
  'active',
  'disabled',
  'visited',
  'checked',
  'group-hover', // Need to set the'group' class of the parent element
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

export enum ElementActionType {
  addProperty,
  deleteProperty,
  setPropertyValue,
  setText,
  setTag,
  // dropped,
}

export interface ElementHistory extends ElementPayload {
  actionType: ElementActionType
  property?: Property
  originalText?: string
  originalTagName?: string
  revoked?: boolean
}

export interface ElementModel {
  states: { [projectId: string]: { elements: Array<ElementState>; historys: Array<ElementHistory> } }
  frontElementStates: Computed<
    ElementModel,
    { elements: Array<ElementState>; historys: Array<ElementHistory> } | undefined,
    StoreModel
  >
  frontHistory: Computed<ElementModel, Array<ElementHistory>, StoreModel>
  selectedElement: Computed<ElementModel, ElementState | undefined, StoreModel>
  selectedElementPropertys: Computed<ElementModel, Array<Property>, StoreModel>
  pendingElements: Computed<ElementModel, Array<ElementState>, StoreModel>

  screenVariants: Computed<ElementModel, Array<string>, StoreModel>
  customVariants: Computed<ElementModel, Array<string>, StoreModel>

  unSelectedAllElements: Action<ElementModel, string>
  focusElement: Action<ElementModel, ElementPayload>
  respElementStatus: Action<ElementModel, ElementActualStatus>
  cleanElements: Action<ElementModel, string>
  savedElements: Action<ElementModel, string>

  pushSelectedElementProperty: Action<ElementModel, { projectId: string; property: Property }>
  setSelectedElementPropertyValue: Action<ElementModel, { projectId: string; propertyId: string; value: string }>
  deleteSelectedElementProperty: Action<ElementModel, { projectId: string; propertyId: string }>
  setSelectedElementText: Action<ElementModel, { projectId: string; text: string }>
  setSelectedElementTag: Action<ElementModel, { projectId: string; tag: ElementTag }>
  droppedSelectedElement: Action<ElementModel, ElementPayload>

  listen: Thunk<ElementModel, void, void, StoreModel>
  unlisten: Action<ElementModel>

  revokeHistory: Action<ElementModel, string>
  redoHistory: Action<ElementModel, string>
}

const elementModel: ElementModel = {
  states: {},
  frontElementStates: computed(
    [(state) => state.states, storeStateProject],
    (states, project) => states[project?.id || ''],
  ),
  frontHistory: computed([(state) => state.frontElementStates], (states) => states?.historys || []),
  selectedElement: computed([(state) => state.frontElementStates], (states) =>
    states?.elements.find((el) => el.selected),
  ),
  selectedElementPropertys: computed((state) => {
    return state.selectedElement?.propertys || []
  }),
  pendingElements: computed(
    [(state) => state.frontElementStates],
    (states) => states?.elements.filter((el) => el.pending) || [],
  ),

  screenVariants: computed([storeStateProject], (frontProject) => {
    if (!frontProject?.tailwindConfig?.theme?.screens) return []
    return Object.keys(frontProject.tailwindConfig.theme.screens)
  }),

  customVariants: computed([storeStateProject], (frontProject) => {
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

    const payloads: ElementPayload[] = state.states[projectId].elements
      .filter((el) => el.pending)
      .map((el) => {
        const { selected, propertys, actualStatus, pending, ...payload } = el
        payload.className = propertysTransClassName(el.propertys)
        if (selected) {
          el.pending = undefined
        }
        return payload
      })

    sendBackIpc(Handler.ApplyElements, payloads as any)
    state.states[projectId].elements = state.states[projectId].elements.filter((el) => el.selected)
    state.states[projectId].historys = []
  }),

  pushSelectedElementProperty: action((state, { projectId, property }) => {
    const pstate = state.states[projectId]
    if (!pstate) return
    const { elements, historys } = pstate

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.propertys.push(property)
    element.pending = true

    const { selected, actualStatus, pending, propertys, ...payload } = element
    pstate.historys = historys.filter((h) => !h.revoked)
    pstate.historys.push({
      ...payload,
      tagName: actualStatus?.tagName,
      actionType: ElementActionType.addProperty,
      property,
    })
  }),
  setSelectedElementPropertyValue: action((state, { projectId, propertyId, value }) => {
    const pstate = state.states[projectId]
    if (!pstate) return
    const { elements, historys } = pstate

    const element = elements.find((el) => el.selected)
    if (!element) return

    const property = element.propertys.find((p) => p.id === propertyId)
    if (!property) return

    const { selected, actualStatus, pending, propertys, ...payload } = element
    pstate.historys = historys.filter((h) => !h.revoked)
    pstate.historys.push({
      ...payload,
      tagName: actualStatus?.tagName,
      actionType: ElementActionType.setPropertyValue,
      property: clone(property), // todo: clone?
      className: value,
    })

    property.classname = value
    element.pending = true
  }),
  deleteSelectedElementProperty: action((state, { projectId, propertyId }) => {
    const pstate = state.states[projectId]
    if (!pstate) return
    const { elements, historys } = pstate

    const element = elements.find((el) => el.selected)
    if (!element) return

    const { selected, actualStatus, pending, propertys, ...payload } = element
    pstate.historys = historys.filter((h) => !h.revoked)
    pstate.historys.push({
      ...payload,
      tagName: actualStatus?.tagName,
      actionType: ElementActionType.deleteProperty,
      property: element.propertys.find((p) => p.id === propertyId),
    })

    element.propertys = element.propertys.filter((p) => p.id !== propertyId)
    element.pending = true
  }),
  setSelectedElementText: action((state, { projectId, text }) => {
    const pstate = state.states[projectId]
    if (!pstate) return
    const { elements, historys } = pstate

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.text = text
    element.pending = true

    const { selected, actualStatus, pending, propertys, ...payload } = element
    pstate.historys = historys.filter((h) => !h.revoked)
    pstate.historys.push({
      ...payload,
      tagName: actualStatus?.tagName,
      actionType: ElementActionType.setText,
      originalText: element.actualStatus?.text,
    })
  }),
  setSelectedElementTag: action((state, { projectId, tag }) => {
    const pstate = state.states[projectId]
    if (!pstate) return
    const { elements, historys } = pstate

    const element = elements.find((el) => el.selected)
    if (!element) return

    element.pending = true
    element.tagName = tag

    const { selected, actualStatus, pending, propertys, ...payload } = element
    pstate.historys = historys.filter((h) => !h.revoked)
    pstate.historys.push({
      ...payload,
      tagName: actualStatus?.tagName,
      actionType: ElementActionType.setTag,
      originalTagName: element.actualStatus?.tagName,
    })
  }),
  droppedSelectedElement: action((state, { projectId, codePosition, dropzoneCodePosition }) => {
    if (!state.states[projectId]) return
    const { elements } = state.states[projectId]

    const element = elements.find((st) => st.codePosition === codePosition)
    if (!element) return

    element.dropzoneCodePosition = dropzoneCodePosition
    element.pending = true
  }),

  listen: thunk(async (actions, none, { getState, getStoreState, getStoreActions }) => {
    actions.unlisten()

    listenMainIpc(MainIpcChannel.FocusElement, (event: IpcRendererEvent, element: ElementPayload) => {
      actions.focusElement(element)
      getStoreActions().project.setProjectViewHistory({ projectId: element.projectId, isView: false })
    })

    listenMainIpc(MainIpcChannel.RespElementStatus, (event: IpcRendererEvent, status: ElementActualStatus) => {
      actions.respElementStatus(status)
    })

    listenMainIpc(MainIpcChannel.BlurElement, (event: IpcRendererEvent, projectId: string) => {
      actions.unSelectedAllElements(projectId)
    })

    listenMainIpc(MainIpcChannel.LoadFinish, (event: IpcRendererEvent, projectId: string) => {
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

    // listenMainIpc(MainIpcChannel.Dropped, (event: IpcRendererEvent, payload: ElementPayload) => {
    //   const { frontProject } = getStoreState().project
    //   if (!frontProject) return

    //   if (getState().states[frontProject.id]?.elements.filter((el) => el.pending).length) {
    //     toast({
    //       title: 'Please save the existing modified element before dropped the element',
    //       status: 'warning',
    //     })
    //     return
    //   }

    //   actions.droppedSelectedElement(payload)
    // })
  }),

  unlisten: action(() => {
    unlistenMainIpc(MainIpcChannel.FocusElement)
    unlistenMainIpc(MainIpcChannel.RespElementStatus)
    unlistenMainIpc(MainIpcChannel.BlurElement)
    unlistenMainIpc(MainIpcChannel.ElementShortcut)
    unlistenMainIpc(MainIpcChannel.CloseFrontProject)
    // unlistenMainIpc(MainIpcChannel.Dropped)
  }),

  revokeHistory: action((state, projectId) => {
    const states = state.states[projectId]
    if (!states) return

    const historys = states.historys.filter((h) => !h.revoked)
    if (!historys || !historys.length) return

    const history = historys[historys.length - 1]
    const element = states.elements.find((el) => el.codePosition === history.codePosition)
    if (!element) return

    switch (history.actionType) {
      case ElementActionType.addProperty: {
        const { property, selector } = history
        if (!property) return
        element.propertys = element.propertys.filter((p) => p.id !== property.id)
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.deleteProperty: {
        const { property, selector } = history
        if (!property) return
        element.propertys.push(property)
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.setPropertyValue: {
        const { property, selector } = history
        if (!property) return
        const exist = element.propertys.find((p) => p.id === property.id)
        if (!exist) return
        exist.classname = property.classname
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.setText: {
        const { originalText, selector } = history
        if (!originalText) return
        element.text = originalText
        sendMainIpc(MainIpcChannel.LiveUpdateText, projectId, selector, originalText)
        break
      }
      case ElementActionType.setTag: {
        const { originalTagName, selector } = history
        if (!originalTagName) return
        element.tagName = originalTagName
        sendMainIpc(MainIpcChannel.LiveUpdateTag, projectId, selector, originalTagName)
        break
      }
      default:
        break
    }

    history.revoked = true
  }),

  redoHistory: action((state, projectId) => {
    const states = state.states[projectId]
    if (!states) return

    const historys = states.historys.filter((h) => h.revoked)
    if (!historys || !historys.length) return

    const history = historys[0]
    const element = states.elements.find((el) => el.codePosition === history.codePosition)
    if (!element) return

    switch (history.actionType) {
      case ElementActionType.addProperty: {
        const { property, selector } = history
        if (!property) return
        element.propertys.push(property)
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.deleteProperty: {
        const { property, selector } = history
        if (!property) return
        element.propertys = element.propertys.filter((p) => p.id !== property.id)
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.setPropertyValue: {
        const { property, className, selector } = history
        if (!property || !className) return
        const exist = element.propertys.find((p) => p.id === property.id)
        if (!exist) return
        property.classname = className
        sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, propertysTransClassName(element.propertys))
        break
      }
      case ElementActionType.setText: {
        const { text, selector } = history
        if (!text) return
        element.text = text
        sendMainIpc(MainIpcChannel.LiveUpdateText, projectId, selector, text)
        break
      }
      case ElementActionType.setTag: {
        const { tagName, selector } = history
        if (!tagName) return
        element.tagName = tagName
        sendMainIpc(MainIpcChannel.LiveUpdateTag, projectId, selector, tagName)
        break
      }
      default:
        break
    }

    history.revoked = undefined
  }),
}

export default elementModel
