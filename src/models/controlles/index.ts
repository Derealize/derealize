/* eslint-disable no-restricted-syntax */
import { Action, action, Thunk, thunk, computed, Computed, thunkOn, ThunkOn } from 'easy-peasy'
import { nanoid } from 'nanoid'
import type { StoreModel } from '../index'
import { Broadcast, Handler } from '../../backend/backend.interface'
import type { FocusElementPayload } from '../../backend/handlers'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow
const { send, listen, unlisten } = window.derealize

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
]
export const ListVariants = ['first', 'last', 'odd', 'even']

export interface Property {
  id: string
  classname: string
  value?: string
  screen?: string
  state?: string
  list?: string
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
  tagName: string | undefined
  setTagName: Action<ControllesModel, string | undefined>

  className: string | undefined
  setClassName: Action<ControllesModel, string | undefined>

  screenVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectScreenVariant: string | undefined
  setSelectScreenVariant: Action<ControllesModel, string | undefined>

  selectStateVariant: string | undefined
  setSelectStateVariant: Action<ControllesModel, string | undefined>

  selectListVariant: string | undefined
  setSelectListVariant: Action<ControllesModel, string | undefined>

  customVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectCustomVariant: string | undefined
  setSelectCustomVariant: Action<ControllesModel, string | undefined>

  dark: boolean
  setDark: Action<ControllesModel, boolean>

  alreadyVariants: Computed<ControllesModel, AlreadyVariants, StoreModel>

  listen: Thunk<ControllesModel, void, void, StoreModel>
  unlisten: Action<ControllesModel>

  propertys: Array<Property>
  computePropertys: Action<ControllesModel>
  setProperty: Action<ControllesModel, Property>
  deleteProperty: Action<ControllesModel, string>
  updateClassName: Thunk<ControllesModel, void, void, StoreModel>

  onOpenProject: ThunkOn<ControllesModel, void, StoreModel>
  onCloseProject: ThunkOn<ControllesModel, void, StoreModel>
}

const controllesModel: ControllesModel = {
  tagName: undefined,
  setTagName: action((state, payload) => {
    state.tagName = payload
  }),

  className: undefined,
  setClassName: action((state, payload) => {
    state.className = payload
  }),

  screenVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.screens)
  }),
  selectScreenVariant: undefined,
  setSelectScreenVariant: action((state, payload) => {
    state.selectScreenVariant = payload
  }),

  selectStateVariant: undefined,
  setSelectStateVariant: action((state, payload) => {
    state.selectStateVariant = payload
  }),

  selectListVariant: undefined,
  setSelectListVariant: action((state, payload) => {
    state.selectListVariant = payload
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
    state.selectCustomVariant = payload
  }),

  dark: false,
  setDark: action((state, payload) => {
    state.dark = payload
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

  listen: thunk(async (actions) => {
    listen(Broadcast.FocusElement, ({ tagName, className }: FocusElementPayload) => {
      actions.setTagName(tagName)
      actions.setClassName(className)
      actions.computePropertys()
    })
  }),

  unlisten: action(() => {
    unlisten(Broadcast.FocusElement)
  }),

  propertys: [],
  computePropertys: action((state) => {
    state.propertys = []
    state.className?.split(/\s+/).forEach((name) => {
      const names = name.split(':')
      const property: Property = {
        id: nanoid(),
        classname: names.splice(-1)[0],
      }
      names.forEach((variant) => {
        if (state.screenVariants.includes(variant)) {
          property.screen = variant
        }
        if (StateVariants.includes(variant)) {
          property.state = variant
        }
        if (ListVariants.includes(variant)) {
          property.list = variant
        }
        if (state.customVariants.includes(variant)) {
          property.custom = variant
        }
      })
      state.propertys.push(property)
    })
  }),
  setProperty: action((state, payload) => {
    const property = state.propertys.find((p) => payload.id === p.id)
    if (property) {
      property.classname = payload.classname
    } else {
      state.propertys.push(payload)
    }
  }),
  deleteProperty: action((state, payload) => {
    state.propertys = state.propertys.filter((p) => payload !== p.id)
  }),
  updateClassName: thunk(async (actions, none, { getState, getStoreState }) => {
    const id = getStoreState().project.frontProject?.url
    if (!id) return

    let className = ''
    getState().propertys.forEach((property) => {
      const { screen, state, list, custom, classname: name } = property
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
      className += `${variants + name} `
    })

    send(Handler.UpdateClass, { id, className })
  }),

  onOpenProject: thunkOn(
    (actions, storeActions) => storeActions.project.openProject,
    (actions, target) => {
      actions.listen()
    },
  ),

  onCloseProject: thunkOn(
    (actions, storeActions) => storeActions.project.closeProject,
    (actions, target) => {
      actions.unlisten()
    },
  ),
}

export default controllesModel
