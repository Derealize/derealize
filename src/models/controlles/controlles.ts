import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { ElementPayload, MainIpcChannel } from '../../interface'
import { StateVariants, StateVariantsType, ListVariants, ListVariantsType } from '../project'
import type { PreloadWindow } from '../../preload'
// import { resolutionAll, compileAll } from './direction-polymorphism'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

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
  setProperty: Thunk<ControllesModel, { propertyId: string; classname: string }, void, StoreModel>
  liveUpdateClassName: Thunk<
    ControllesModel,
    { propertyId: string; classname: string; cleanPropertyIds: Array<string> },
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

  propertys: Computed<ControllesModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<ControllesModel, AlreadyVariants, StoreModel>
}

const controllesModel: ControllesModel = {
  setProperty: thunk(async (actions, { propertyId, classname }, { getState, getStoreActions }) => {
    const { selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant, selectDark } = getState()
    const property = {
      id: propertyId,
      classname,
      screen: selectScreenVariant,
      state: selectStateVariant,
      list: selectListVariant,
      custom: selectCustomVariant,
      dark: selectDark ? true : undefined,
    }
    getStoreActions().project.setActiveElementProperty(property)
  }),

  liveUpdateClassName: thunk(
    async (actions, { propertyId, classname, cleanPropertyIds }, { getState, getStoreState }) => {
      const { activeElement, frontProject } = getStoreState().project
      if (!activeElement || !frontProject) return
      const { selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant, selectDark } = getState()

      const gProperty = {
        id: propertyId,
        classname,
        screen: selectScreenVariant,
        state: selectStateVariant,
        list: selectListVariant,
        custom: selectCustomVariant,
        dark: selectDark ? true : undefined,
      }

      const propertys = clone(activeElement.propertys.filter((p) => !cleanPropertyIds.includes(p.id)))
      const target = propertys.find((p) => p.id === propertyId)

      if (target) {
        Object.assign(target, gProperty)
      } else {
        propertys.push(gProperty)
      }

      let className = ''
      propertys.forEach((property) => {
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
    },
  ),

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
