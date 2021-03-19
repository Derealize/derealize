import { Action, action, Thunk, thunk } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore } = window.derealize

export enum Responsive {
  null = '',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xl2 = '2xl',
}

export enum ElementState {
  null = '',
  Hover = 'hover',
  Focus = 'focus',
  Active = 'active',
  Disabled = 'disabled',
  Visited = 'visited',
  Checked = 'checked',
}

export interface VariantsModel {
  responsive: Responsive
  setResponsive: Action<VariantsModel, Responsive>

  elementState: ElementState
  setElementState: Action<VariantsModel, ElementState>
}

const variantsModel: VariantsModel = {
  responsive: Responsive.null,

  setResponsive: action((state, payload) => {
    state.responsive = payload
  }),

  elementState: ElementState.null,
  setElementState: action((state, payload) => {
    state.elementState = payload
  }),
}

export default variantsModel
