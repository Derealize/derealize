import { Action, action, Thunk, thunk } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import { Broadcast, FocusElementPayload } from '../backend/backend.interface'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore, send, listen, unlisten } = window.derealize

export enum Responsive {
  Null = '',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xl2 = '2xl',
}

export enum ElementState {
  Null = '',
  Hover = 'hover',
  Focus = 'focus',
  Active = 'active',
  Disabled = 'disabled',
  Visited = 'visited',
  Checked = 'checked',
}

export interface ControllesModel {
  responsive: Responsive
  setResponsive: Action<ControllesModel, Responsive>

  elementState: ElementState
  setElementState: Action<ControllesModel, ElementState>

  dark: boolean
  setDark: Action<ControllesModel, boolean>

  listen: Thunk<ControllesModel>
  unlisten: Action<ControllesModel>
}

const controllesModel: ControllesModel = {
  responsive: Responsive.Null,

  setResponsive: action((state, payload) => {
    state.responsive = payload
  }),

  elementState: ElementState.Null,
  setElementState: action((state, payload) => {
    state.elementState = payload
  }),

  dark: false,
  setDark: action((state, payload) => {
    state.dark = payload
  }),

  listen: thunk(async (actions, none, { getState }) => {
    listen(Broadcast.FocusElement, (payload: FocusElementPayload) => {})
  }),

  unlisten: action(() => {
    unlisten(Broadcast.FocusElement)
  }),
}

export default controllesModel
