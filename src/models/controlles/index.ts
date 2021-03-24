/* eslint-disable no-restricted-syntax */
import { Action, action, Thunk, thunk, computed, Computed, thunkOn, ThunkOn } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { Broadcast } from '../../backend/backend.interface'
import type { FocusElementPayload } from '../../backend/handlers'
import type { PreloadWindow } from '../../preload'
import type { Project } from '../project'

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
  classname: string
  screen?: string
  state?: string
  list?: string
  custom?: string
  dark?: boolean
}

export interface ControllesModel {
  tagName: string | null
  setTagName: Action<ControllesModel, string | null>

  className: string | null
  setClassName: Action<ControllesModel, string | null>

  screenVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectScreenVariant: string | null
  setSelectScreenVariant: Action<ControllesModel, string | null>
  alreadyScreenVariants: Computed<ControllesModel, Array<string>, StoreModel>

  selectStateVariant: string | null
  setSelectStateVariant: Action<ControllesModel, string | null>
  alreadyStateVariants: Computed<ControllesModel, Array<string>, StoreModel>

  selectListVariant: string | null
  setSelectListVariant: Action<ControllesModel, string | null>
  alreadyListVariants: Computed<ControllesModel, Array<string>, StoreModel>

  customVariants: Computed<ControllesModel, Array<string>, StoreModel>
  selectCustomVariant: string | null
  setSelectCustomVariant: Action<ControllesModel, string | null>
  alreadyCustomVariants: Computed<ControllesModel, Array<string>, StoreModel>

  dark: boolean
  setDark: Action<ControllesModel, boolean>

  listen: Thunk<ControllesModel, void, void, StoreModel>
  unlisten: Action<ControllesModel>

  propertys: Computed<ControllesModel, Array<Property>, StoreModel>

  onOpenProject: ThunkOn<ControllesModel, void, StoreModel>
  onCloseProject: ThunkOn<ControllesModel, void, StoreModel>
}

const controllesModel: ControllesModel = {
  tagName: null,
  setTagName: action((state, payload) => {
    state.tagName = payload
  }),

  className: null,
  setClassName: action((state, payload) => {
    state.className = payload
  }),

  screenVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.screens)
  }),
  selectScreenVariant: null,
  setSelectScreenVariant: action((state, payload) => {
    state.selectScreenVariant = payload
  }),
  alreadyScreenVariants: computed([(state) => state.propertys], (propertys) => {
    return propertys.filter((property) => property.screen).map((property) => property.screen as string)
  }),

  selectStateVariant: null,
  setSelectStateVariant: action((state, payload) => {
    state.selectStateVariant = payload
  }),
  alreadyStateVariants: computed([(state) => state.propertys], (propertys) =>
    propertys.filter((property) => property.state).map((property) => property.state as string),
  ),

  selectListVariant: null,
  setSelectListVariant: action((state, payload) => {
    state.selectListVariant = payload
  }),
  alreadyListVariants: computed([(state) => state.propertys], (propertys) =>
    propertys.filter((property) => property.list).map((property) => property.list as string),
  ),

  customVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    let result: Array<string> = []
    for (const [, variants] of Object.entries(project.tailwindConfig.variants)) {
      const leftVariants = variants.filter(
        (v) => v !== 'responsive' && v !== 'dark' && !StateVariants.includes(v) && !ListVariants.includes(v),
      )
      result = result.concat(leftVariants)
    }
    return result
  }),
  selectCustomVariant: null,
  setSelectCustomVariant: action((state, payload) => {
    state.selectCustomVariant = payload
  }),
  alreadyCustomVariants: computed([(state) => state.propertys], (propertys) =>
    propertys.filter((property) => property.custom).map((property) => property.custom as string),
  ),

  dark: false,
  setDark: action((state, payload) => {
    state.dark = payload
  }),

  listen: thunk(async (actions) => {
    listen(Broadcast.FocusElement, ({ tagName, className }: FocusElementPayload) => {
      actions.setTagName(tagName)
      actions.setClassName(className)
    })
  }),

  unlisten: action(() => {
    unlisten(Broadcast.FocusElement)
  }),

  propertys: computed(
    [(state) => state.className, (state) => state.screenVariants, (state) => state.customVariants],
    (className, screenVariants, customVariants) => {
      const propertys: Array<Property> = []
      className?.split(/\s+/).forEach((name) => {
        const variants = name.split(':')
        const property: Property = {
          classname: variants.splice(-1)[0],
        }
        variants.forEach((variant) => {
          if (screenVariants.includes(variant)) {
            property.screen = variant
          }
          if (StateVariants.includes(variant)) {
            property.state = variant
          }
          if (ListVariants.includes(variant)) {
            property.list = variant
          }
          if (customVariants.includes(variant)) {
            property.custom = variant
          }
        })
        propertys.push(property)
      })
      return propertys
    },
  ),

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
