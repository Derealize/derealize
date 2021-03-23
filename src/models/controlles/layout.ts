import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { Broadcast } from '../../backend/backend.interface'
import type { PreloadWindow } from '../../preload'
import { Property } from '.'

declare const window: PreloadWindow
const { send, listen, unlisten } = window.derealize

const containerName = 'container'

export enum BoxSizing {
  'boxBorder',
  'boxContent',
}

export interface LayoutModel {
  containerPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  setContainerProperty: Action<LayoutModel, Property>

  alreadyScreenVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyStateVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyListVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyCustomVariants: Computed<LayoutModel, Array<string>, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter((property) => property.classname === 'container'),
  ),
  // alreadyScreenVariants: computed([(state, storeState) => storeState.controlles.propertys], (propertys) => {
  //   return propertys.filter((property) => property.classname).map((property) => property.screen as string)
  // }),
}

export default layoutModel
