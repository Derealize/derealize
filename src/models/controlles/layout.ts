import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { Broadcast } from '../../backend/backend.interface'
import type { PreloadWindow } from '../../preload'
import { PropertyVariants } from '.'

declare const window: PreloadWindow
const { send, listen, unlisten } = window.derealize

export type ContainerProperty = PropertyVariants & { apply: boolean }

export interface LayoutModel {
  containerPropertys: Array<ContainerProperty>
  setContainerProperty: Action<LayoutModel, ContainerProperty>

  alreadyScreenVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyStateVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyListVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyCustomVariants: Computed<LayoutModel, Array<string>, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: [{ apply: false }],
  setContainerProperty: action((state, payload) => {
    const property = state.containerPropertys.find(
      (prop) => prop.dark === payload.dark && prop.list === payload.list && prop.screen === payload.screen,
    )
    if (property) {
      property.apply = payload.apply
    } else {
      state.containerPropertys.push(payload)
    }
  }),

  alreadyScreenVariants: computed(
    [
      (state, storeState) => storeState.controlles.className,
      (state, storeState) => storeState.controlles.screenVariants,
    ],
    (className, screenVariants) => {
      if (!className || !screenVariants.length) return []
      const variants: Array<string> = []

      className.split(' ').forEach((name) => {
        const words = name.split(':')
        const property = words[words.length - 1]
        words.forEach((word, index) => {
          if (screenVariants.includes(word) && index < words.length - 1) {
            variants.push(word)
          }
        })
      })

      return variants
    },
  ),
}

export default layoutModel
