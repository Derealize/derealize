import { Action, action, Thunk, thunk, actionOn, ActionOn, thunkOn, ThunkOn } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import type { StoreModel } from '../index'
import { Broadcast } from '../../backend/backend.interface'
import type { PreloadWindow } from '../../preload'
import { ElementStates, VariantsProperty } from '.'

declare const window: PreloadWindow
const { send, listen, unlisten } = window.derealize

export type ContainerPropertys = Array<VariantsProperty & { apply: boolean }>

export interface LayoutModel {
  container: ContainerPropertys
  setContainer: Action<LayoutModel, ContainerPropertys>
}

const layoutModel: LayoutModel = {
  container: [{ apply: false }],

  setContainer: action((state, payload) => {
    state.container = payload
  }),
}

export default layoutModel
