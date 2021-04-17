/* eslint-disable no-restricted-syntax */
import { Action, action, Thunk, thunk, computed, Computed, thunkOn, ThunkOn } from 'easy-peasy'
import { nanoid } from 'nanoid'
import type { StoreModel } from '../index'
import { Broadcast, Handler, ElementPayload } from '../../backend/backend.interface'
import type { PreloadWindow } from '../../preload'
// import { resolutionAll, compileAll } from './direction-polymorphism'

declare const window: PreloadWindow
const { send, listen, unlisten, deviceEmulation } = window.derealize

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
  propertys: Array<Property>

  element: ElementPayload | undefined
  setElement: Action<ControllesModel, ElementPayload | undefined>

  setProperty: Action<ControllesModel, Property>
  deleteProperty: Action<ControllesModel, string>

  updateClassName: Thunk<ControllesModel, boolean | undefined, void, StoreModel>

  screenVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectScreenVariant: string | undefined
  setSelectScreenVariant: Action<ControllesModel, string | undefined>
  setSelectScreenVariantWithDevice: Thunk<ControllesModel, string | undefined, void, StoreModel>

  selectStateVariant: StateVariantsType | undefined
  setSelectStateVariant: Action<ControllesModel, StateVariantsType | undefined>

  selectListVariant: ListVariantsType | undefined
  setSelectListVariant: Action<ControllesModel, ListVariantsType | undefined>

  customVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectCustomVariant: string | undefined
  setSelectCustomVariant: Action<ControllesModel, string | undefined>

  selectDark: boolean
  setSelectDark: Action<ControllesModel, boolean>

  alreadyVariants: Computed<ControllesModel, AlreadyVariants, StoreModel>
}

const controllesModel: ControllesModel = {
  propertys: [],

  element: undefined,
  setElement: action((state, payload) => {
    state.element = payload
    state.propertys = []
    if (!state.element?.className) return

    state.element.className.split(/\s+/).forEach((name) => {
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
      state.propertys.push(property)
    })
    // state.propertys = resolutionAll(state.propertys)
  }),

  setProperty: action((state, payload) => {
    const property = state.propertys.find((p) => payload.id === p.id)
    if (property) {
      property.classname = payload.classname
      property.screen = state.selectScreenVariant
      property.state = state.selectStateVariant
      property.list = state.selectListVariant
      property.custom = state.selectCustomVariant
      property.dark = state.selectDark ? true : undefined
    } else {
      payload.screen = state.selectScreenVariant
      payload.state = state.selectStateVariant
      payload.list = state.selectListVariant
      payload.custom = state.selectCustomVariant
      payload.dark = state.selectDark ? true : undefined
      state.propertys.push(payload)
    }
  }),
  deleteProperty: action((state, payload) => {
    state.propertys = state.propertys.filter((p) => payload !== p.id)
  }),

  updateClassName: thunk(async (actions, useShift, { getState }) => {
    const { propertys, element } = getState()
    if (!element) return
    // const compiledPropertys = compileAll(propertys)

    let className = ''
    propertys.forEach((property) => {
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

    send(Handler.UpdateClass, { ...element, className, useShift })
  }),

  screenVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.screens)
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
      deviceEmulation(frontProject.url, width)
    }
  }),
  selectStateVariant: undefined,
  setSelectStateVariant: action((state, payload) => {
    state.selectStateVariant = state.selectStateVariant === payload ? undefined : payload
  }),

  selectListVariant: undefined,
  setSelectListVariant: action((state, payload) => {
    state.selectListVariant = state.selectListVariant === payload ? undefined : payload
  }),

  customVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    let result: Array<string> = []
    for (const [, variants] of Object.entries(project.tailwindConfig.variants)) {
      const leftVariants = variants.filter(
        (v) => v !== 'responsive' && v !== 'dark' && !StateVariants.includes(v) && !ListVariants.includes(v),
      )
      result = result.concat(leftVariants)
    }
    return [...new Set(result)]
  }),
  selectCustomVariant: undefined,
  setSelectCustomVariant: action((state, payload) => {
    state.selectCustomVariant = state.selectCustomVariant === payload ? undefined : payload
  }),

  selectDark: false,
  setSelectDark: action((state, payload) => {
    state.selectDark = payload
  }),

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
