import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import { nanoid } from 'nanoid'
import type { StoreModel } from '../index'
import { MainIpcChannel, JitTiggerPayload } from '../../interface'
import { StateVariantsType, ListVariantsType } from '../element'
import type { PreloadWindow } from '../../preload'
import { Handler } from '../../backend/backend.interface'
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
  dark: boolean
}

export interface ControllesModel {
  pushNewProperty: Thunk<ControllesModel, string, void, StoreModel>
  liveUpdateClassName: Thunk<
    ControllesModel,
    { propertysClone: Array<Property>; propertyId: string; classname: string; projectId: string },
    void,
    StoreModel
  >
  liveApplyClassName: Thunk<ControllesModel, void, void, StoreModel>
  jitClassNames: Thunk<ControllesModel, { project: Project; classNames: Array<string> }, void, StoreModel>

  selectScreenVariant: string | undefined
  setSelectScreenVariant: Action<ControllesModel, string | undefined>
  setSelectScreenVariantWithDevice: Thunk<ControllesModel, string | undefined, void, StoreModel>

  selectStateVariant: StateVariantsType | undefined
  setSelectStateVariant: Action<ControllesModel, StateVariantsType | undefined>
  setSelectStateVariantThunk: Thunk<ControllesModel, StateVariantsType | undefined>

  selectListVariant: ListVariantsType | undefined
  setSelectListVariant: Action<ControllesModel, ListVariantsType | undefined>

  selectCustomVariant: string | undefined
  setSelectCustomVariant: Action<ControllesModel, string | undefined>

  selectDark: boolean
  setSelectDark: Action<ControllesModel, boolean>

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
    getStoreActions().element.pushActiveElementProperty({ projectId: frontProject.id, property })
  }),

  liveUpdateClassName: thunk(async (actions, { propertysClone, propertyId, classname, projectId }, { getState }) => {
    const { selectStateVariant } = getState()

    const property = propertysClone.find((p) => p.id === propertyId)

    if (property) {
      property.classname = classname
    } else {
      const { selectScreenVariant, selectListVariant, selectCustomVariant, selectDark } = getState()
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

    let className = ''
    propertysClone.forEach((item) => {
      const { screen, state, list, custom, dark, classname: name } = item
      if (!name) return

      let variants = ''
      if (screen) {
        variants += `${screen}:`
      }
      if (state && state !== selectStateVariant) {
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

    sendMainIpc(MainIpcChannel.LiveUpdateClass, projectId, className)
  }),

  liveApplyClassName: thunk(async (actions, none, { getState, getStoreState }) => {
    const {
      project: { frontProject },
      element: { activeElement },
    } = getStoreState()

    if (!frontProject || !activeElement) return

    const { selectStateVariant } = getState()

    let className = ''
    activeElement.propertys.forEach((property) => {
      const { screen, state, list, custom, dark, classname: name } = property
      if (!name) return

      let variants = ''
      if (screen) {
        variants += `${screen}:`
      }
      if (state && state !== selectStateVariant) {
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

    sendMainIpc(MainIpcChannel.LiveUpdateClass, frontProject.id, className, true)
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
  setSelectScreenVariantWithDevice: thunk(async (actions, payload, { getStoreState }) => {
    actions.setSelectScreenVariant(payload)
    const { frontProject } = getStoreState().project
    if (frontProject && frontProject.tailwindConfig) {
      let width = 0
      if (payload !== undefined) {
        const screen = frontProject.tailwindConfig.theme.screens[payload]
        if (screen.includes('px')) {
          width = parseInt(screen.replace('px', ''), 10)
        }
      }
      sendMainIpc(MainIpcChannel.DeviceEmulation, frontProject.id, width)
    }
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

  expandVariants: false,
  setExpandVariants: action((state, payload) => {
    state.expandVariants = payload
  }),

  alreadyVariants: computed([(state, storeState) => storeState.element.activePropertys], (propertys) => {
    const screens = propertys.filter((property) => property.screen).map((property) => property.screen as string)
    const states = propertys.filter((property) => property.state).map((property) => property.state as string)
    const lists = propertys.filter((property) => property.list).map((property) => property.list as string)
    const customs = propertys.filter((property) => property.custom).map((property) => property.custom as string)
    return {
      screens: [...new Set(screens)],
      states: [...new Set(states)],
      lists: [...new Set(lists)],
      customs: [...new Set(customs)],
      dark: propertys.some((property) => property.dark),
    }
  }),
}

export default controllesModel
