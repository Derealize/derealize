import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import { nanoid } from 'nanoid'
import type { StoreModel } from '../index'
import { MainIpcChannel } from '../../interface'
import { StateVariantsType, ListVariantsType } from '../project'
import type { PreloadWindow } from '../../preload'
// import { resolutionAll, compileAll } from './direction-polymorphism'

declare const window: PreloadWindow
const { sendMainIpc } = window.derealize

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

  propertys: Computed<ControllesModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<ControllesModel, AlreadyVariants, StoreModel>
}

const controllesModel: ControllesModel = {
  pushNewProperty: thunk(async (actions, classname, { getState, getStoreActions }) => {
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
    getStoreActions().project.pushActiveElementProperty(property)
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

    sendMainIpc(MainIpcChannel.LiveUpdateClass, { projectId, className } as any)
  }),

  liveApplyClassName: thunk(async (actions, none, { getState, getStoreState }) => {
    const { activeElement, frontProject } = getStoreState().project
    if (!activeElement || !frontProject) return
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

    sendMainIpc(MainIpcChannel.LiveUpdateClass, { projectId: frontProject.id, className } as any)
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

  propertys: computed([(state, storeState) => storeState.project.activeElement], (element) => element?.propertys || []),

  alreadyVariants: computed([(state) => state.propertys], (propertys) => {
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
