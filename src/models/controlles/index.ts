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

// 这些variant类型切分后各自单选，只是遵循设计经验。本质上所有variant都可以多选应用在同一个属性上
export const StateVariants = [
  'hover',
  'focus',
  'active',
  'disabled',
  'visited',
  'checked',
  'group-hover', // 需要父元素辅助设置 'group' class
  'group-focus',
  'focus-within',
  'focus-visible',
]
export const ListVariants = ['first', 'last', 'odd', 'even']

export interface PropertyVariants {
  screen?: string
  state?: string
  list?: string
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

  screenVariants: computed(
    [(state) => state.className, (state, storeState) => storeState.project.frontProject],
    (className, project) => {
      if (!project?.tailwindConfig || !className) return []
      return Object.keys(project.tailwindConfig.theme.screens)
    },
  ),
  selectScreenVariant: null,
  setSelectScreenVariant: action((state, payload) => {
    state.selectScreenVariant = payload
  }),
  alreadyScreenVariants: computed(
    [(state) => state.className, (state) => state.screenVariants],
    (className, screenVariants) => {
      if (!className || !screenVariants.length) return []
      const variants: Array<string> = []

      className.split(' ').forEach((name) => {
        const words = name.split(':')
        words.forEach((word, index) => {
          if (screenVariants.includes(word) && index < words.length - 1) {
            variants.push(word)
          }
        })
      })

      return variants
    },
  ),

  selectStateVariant: null,
  setSelectStateVariant: action((state, payload) => {
    state.selectStateVariant = payload
  }),
  alreadyStateVariants: computed([(state) => state.className], (className) => {
    if (!className) return []
    const variants: Array<string> = []

    className.split(' ').forEach((name) => {
      const words = name.split(':')
      words.forEach((word, index) => {
        if (StateVariants.includes(word) && index < words.length - 1) {
          variants.push(word)
        }
      })
    })

    return variants
  }),

  selectListVariant: null,
  setSelectListVariant: action((state, payload) => {
    state.selectListVariant = payload
  }),
  alreadyListVariants: computed([(state) => state.className], (className) => {
    if (!className) return []
    const variants: Array<string> = []

    className.split(' ').forEach((name) => {
      const words = name.split(':')
      words.forEach((word, index) => {
        if (ListVariants.includes(word) && index < words.length - 1) {
          variants.push(word)
        }
      })
    })

    return variants
  }),

  customVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    let result: Array<string> = []
    for (const [, variants] of Object.entries(project.tailwindConfig.variants)) {
      const leftVariants = variants.filter(
        (v) => v !== 'responsive' && !StateVariants.includes(v) && !ListVariants.includes(v),
      )
      result = result.concat(leftVariants)
    }
    return result
  }),
  selectCustomVariant: null,
  setSelectCustomVariant: action((state, payload) => {
    state.selectCustomVariant = payload
  }),
  alreadyCustomVariants: computed(
    [(state) => state.className, (state) => state.customVariants],
    (className, customVariants) => {
      if (!className || !customVariants.length) return []
      const variants: Array<string> = []

      className.split(' ').forEach((name) => {
        const words = name.split(':')
        words.forEach((word, index) => {
          if (customVariants.includes(word) && index < words.length - 1) {
            variants.push(word)
          }
        })
      })

      return variants
    },
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
