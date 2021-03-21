import { Action, action, Thunk, thunk, computed, Computed, thunkOn, ThunkOn } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { Broadcast } from '../../backend/backend.interface'
import type { FocusElementPayload } from '../../backend/handlers'
import type { PreloadWindow } from '../../preload'
import type { Project } from '../project'

declare const window: PreloadWindow
const { send, listen, unlisten } = window.derealize

export const ElementStates = ['hover', 'focus', 'active', 'disabled', 'visited', 'checked']
export const ListIndexs = ['first', 'last', 'odd', 'even']

export interface VariantsProperty {
  responsive?: string
  state?: string
  dark?: boolean
}

export interface ControllesModel {
  screens: Computed<ControllesModel, Array<string>, StoreModel>

  tagName: string | null
  setTagName: Action<ControllesModel, string | null>

  className: string | null
  setClassName: Action<ControllesModel, string | null>

  selectResponsive: string | null
  setSelectResponsive: Action<ControllesModel, string | null>
  alreadyResponsives: Computed<ControllesModel, Array<string>, StoreModel>

  selectElementState: string | null
  setSelectElementState: Action<ControllesModel, string | null>
  alreadyElementStates: Computed<ControllesModel, Array<string>, StoreModel>

  selectListIndex: string | null
  setSelectListIndex: Action<ControllesModel, string | null>
  alreadyListIndexs: Computed<ControllesModel, Array<string>, StoreModel>

  dark: boolean
  setDark: Action<ControllesModel, boolean>

  listen: Thunk<ControllesModel>
  unlisten: Action<ControllesModel>

  onOpenProject: ThunkOn<ControllesModel, void, StoreModel>
  onCloseProject: ThunkOn<ControllesModel, void, StoreModel>
}

const controllesModel: ControllesModel = {
  screens: computed(
    [(state) => state.className, (state, storeState) => storeState.project.frontProject],
    (className, project) => {
      if (!project?.tailwindConfig || !className) return []
      return Object.keys(project.tailwindConfig.theme.screens)
    },
  ),

  tagName: null,
  setTagName: action((state, payload) => {
    state.tagName = payload
  }),

  className: null,
  setClassName: action((state, payload) => {
    state.className = payload
  }),

  selectResponsive: null,
  setSelectResponsive: action((state, payload) => {
    state.selectResponsive = payload
  }),
  alreadyResponsives: computed(
    [(state) => state.className, (state, storeState) => state.screens],
    (className, screens) => {
      if (!screens.length || !className) return []
      const alreadyResponsives: Array<string> = []

      className.split(' ').forEach((name) => {
        const words = name.split(':')
        words.forEach((word, index) => {
          if (screens.includes(word) && index < words.length - 1) {
            alreadyResponsives.push(word)
          }
        })
      })

      return alreadyResponsives
    },
  ),

  selectElementState: null,
  setSelectElementState: action((state, payload) => {
    state.selectElementState = payload
  }),
  alreadyElementStates: computed([(state) => state.className], (className) => {
    if (!className) return []
    const alreadyElementStates: Array<string> = []

    className.split(' ').forEach((name) => {
      const words = name.split(':')
      words.forEach((word, index) => {
        if (ElementStates.includes(word) && index < words.length - 1) {
          alreadyElementStates.push(word)
        }
      })
    })

    return alreadyElementStates
  }),

  selectListIndex: null,
  setSelectListIndex: action((state, payload) => {
    state.selectListIndex = payload
  }),
  alreadyListIndexs: computed([(state) => state.className], (className) => {
    if (!className) return []
    const alreadyListIndexs: Array<string> = []

    className.split(' ').forEach((name) => {
      const words = name.split(':')
      words.forEach((word, index) => {
        if (ListIndexs.includes(word) && index < words.length - 1) {
          alreadyListIndexs.push(word)
        }
      })
    })

    return alreadyListIndexs
  }),

  dark: false,
  setDark: action((state, payload) => {
    state.dark = payload
  }),

  listen: thunk(async (actions, none, { getState }) => {
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
