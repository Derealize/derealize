import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import { nanoid } from 'nanoid'
import { propertysTransClassName } from '../../utils/assest'
import { StateVariantsType, ListVariantsType } from '../element'
import { MainIpcChannel, JitTiggerPayload } from '../../interface'
import { Handler } from '../../backend/backend.interface'
import type { StoreModel } from '../index'
import type { PreloadWindow } from '../../preload'
import type { Project } from '../project.interface'
// import { resolutionAll, compileAll } from './direction-polymorphism'

declare const window: PreloadWindow
const { sendMainIpc, sendBackIpc } = window.derealize

export interface Property {
  id: string
  classname: string
  screen?: string
  state?: StateVariantsType
  list?: ListVariantsType
  custom?: string
  dark?: boolean
}

export interface AlreadyVariants {
  screens: Array<string>
  states: Array<string>
  lists: Array<string>
  customs: Array<string>
  hasDark: boolean
  hasNone: boolean
}

export interface ControllesModel {
  pushNewProperty: Thunk<ControllesModel, string, void, StoreModel>
  liveHoverClassName: Thunk<
    ControllesModel,
    { propertysClone: Array<Property>; selector: string; propertyId: string; classname: string; projectId: string },
    void,
    StoreModel
  >
  liveApplyClassName: Thunk<ControllesModel, void, void, StoreModel>
  jitClassNames: Thunk<ControllesModel, { project: Project; classNames: Array<string> }, void, StoreModel>

  selectScreenVariant: string | undefined
  setSelectScreenVariant: Action<ControllesModel, string>
  setSelectScreenVariantWithDevice: Thunk<ControllesModel, string, void, StoreModel>

  selectStateVariant: StateVariantsType | undefined
  setSelectStateVariant: Action<ControllesModel, StateVariantsType | undefined>
  setSelectStateVariantThunk: Thunk<ControllesModel, StateVariantsType | undefined>

  selectListVariant: ListVariantsType | undefined
  setSelectListVariant: Action<ControllesModel, ListVariantsType | undefined>

  selectCustomVariant: string | undefined
  setSelectCustomVariant: Action<ControllesModel, string | undefined>

  selectDark: boolean
  setSelectDark: Action<ControllesModel, boolean>

  clearSelectVariant: Action<ControllesModel>

  expandVariants: boolean
  setExpandVariants: Action<ControllesModel, boolean>

  alreadyVariants: Computed<ControllesModel, AlreadyVariants, StoreModel>
}

const controllesModel: ControllesModel = {
  pushNewProperty: thunk(async (actions, classname, { getState, getStoreState, getStoreActions }) => {
    const { frontProject } = getStoreState().project
    if (!frontProject) return

    const { selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant, selectDark } = getState()
    const property = {
      id: nanoid(),
      classname,
      screen: selectScreenVariant,
      state: selectStateVariant,
      list: selectListVariant,
      custom: selectCustomVariant,
      dark: selectDark ? true : undefined,
    }
    getStoreActions().element.pushSelectedElementProperty({ projectId: frontProject.id, property })
  }),

  liveHoverClassName: thunk(
    async (actions, { propertysClone, selector, propertyId, classname, projectId }, { getState }) => {
      const { selectStateVariant } = getState()

      const property = propertysClone.find((p) => p.id === propertyId)
      const { selectScreenVariant, selectListVariant, selectCustomVariant, selectDark } = getState()

      if (property) {
        property.classname = classname
        property.screen = selectScreenVariant
        property.state = selectStateVariant
        property.list = selectListVariant
        property.custom = selectCustomVariant
        property.dark = selectDark ? true : undefined
      } else {
        propertysClone.push({
          id: propertyId,
          classname,
          screen: selectScreenVariant,
          state: selectStateVariant,
          list: selectListVariant,
          custom: selectCustomVariant,
          dark: selectDark ? true : undefined,
        })
      }

      const className = propertysTransClassName(propertysClone)
      sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, selector, className)
    },
  ),

  liveApplyClassName: thunk(async (actions, none, { getStoreState }) => {
    const {
      project: { frontProject },
      element: { selectedElement },
    } = getStoreState()

    if (!frontProject || !selectedElement) return

    const className = propertysTransClassName(selectedElement.propertys)
    sendMainIpc(MainIpcChannel.LiveUpdateClass, frontProject.id, selectedElement.selector, className, true)
  }),
  jitClassNames: thunk(async (actions, { project, classNames }, { getState, getStoreActions }) => {
    const { selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant, selectDark } = getState()
    let className = ''
    classNames.forEach((name) => {
      if (!name) return

      let variants = ''
      if (selectScreenVariant) {
        variants += `${selectScreenVariant}:`
      }
      if (selectStateVariant) {
        variants += `${selectStateVariant}:`
      }
      if (selectListVariant) {
        variants += `${selectListVariant}:`
      }
      if (selectCustomVariant) {
        variants += `${selectCustomVariant}:`
      }
      if (selectDark) {
        variants += `dark:`
      }
      className += `${variants + name} `
    })

    if (project.jitClassName === className) return

    const payload: JitTiggerPayload = { projectId: project.id, className }
    getStoreActions().project.setJitClassName(payload)
    sendBackIpc(Handler.JitTigger, payload as any)
  }),

  selectScreenVariant: undefined,
  setSelectScreenVariant: action((state, payload) => {
    state.selectScreenVariant = state.selectScreenVariant === payload ? undefined : payload
  }),
  setSelectScreenVariantWithDevice: thunk(async (actions, payload, { getState, getStoreState }) => {
    actions.setSelectScreenVariant(payload)
    const { frontProject } = getStoreState().project
    if (!frontProject || !frontProject.tailwindConfig) return

    const { selectScreenVariant } = getState()
    let width = 0
    if (selectScreenVariant !== undefined) {
      const screen = frontProject.tailwindConfig.theme.screens[selectScreenVariant]
      if (screen.includes('px')) {
        width = parseInt(screen.replace('px', ''), 10)
      }
    }
    sendMainIpc(MainIpcChannel.DeviceEmulation, frontProject.id, width)
  }),
  selectStateVariant: undefined,
  setSelectStateVariant: action((state, payload) => {
    state.selectStateVariant = state.selectStateVariant === payload ? undefined : payload
  }),
  setSelectStateVariantThunk: thunk(async (actions, payload) => {
    actions.setSelectStateVariant(payload)
    actions.liveApplyClassName()
  }),

  selectListVariant: undefined,
  setSelectListVariant: action((state, payload) => {
    state.selectListVariant = state.selectListVariant === payload ? undefined : payload
  }),

  selectCustomVariant: undefined,
  setSelectCustomVariant: action((state, payload) => {
    state.selectCustomVariant = state.selectCustomVariant === payload ? undefined : payload
  }),

  selectDark: false,
  setSelectDark: action((state, payload) => {
    state.selectDark = payload
  }),

  clearSelectVariant: action((state) => {
    state.selectScreenVariant = undefined
    state.selectStateVariant = undefined
    state.selectListVariant = undefined
    state.selectCustomVariant = undefined
    state.selectDark = false
  }),

  expandVariants: false,
  setExpandVariants: action((state, payload) => {
    state.expandVariants = payload
  }),

  alreadyVariants: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) => {
    const screens = propertys.filter((property) => property.screen).map((property) => property.screen as string)
    const states = propertys.filter((property) => property.state).map((property) => property.state as string)
    const lists = propertys.filter((property) => property.list).map((property) => property.list as string)
    const customs = propertys.filter((property) => property.custom).map((property) => property.custom as string)
    return {
      screens: [...new Set(screens)],
      states: [...new Set(states)],
      lists: [...new Set(lists)],
      customs: [...new Set(customs)],
      hasDark: propertys.some((property) => property.dark),
      hasNone: propertys.some(
        (property) => !property.screen && !property.state && !property.list && !property.custom && !property.dark,
      ),
    }
  }),
}

export default controllesModel
