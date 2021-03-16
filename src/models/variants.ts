import { Action, action, Thunk, thunk } from 'easy-peasy'
import clone from 'lodash.clonedeep'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore } = window.derealize

export interface Responsive {
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xl2: boolean
}

export interface VariantsModel {
  responsive: Responsive
  setResponsive: Action<VariantsModel, Responsive>

  hover: boolean
  setHover: Action<VariantsModel, boolean>
  hoverTargets: Array<string>
  addHoverTargets: Action<VariantsModel, Array<string>>

  focus: boolean
  setFocus: Action<VariantsModel, boolean>
  focusTargets: Array<string>
  addFocusTargets: Action<VariantsModel, Array<string>>

  active: boolean
  setActive: Action<VariantsModel, boolean>
}

const variantsModel: VariantsModel = {
  responsive: {
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xl2: false,
  },
  setResponsive: action((state, payload) => {
    state.responsive = payload
  }),

  hover: false,
  setHover: action((state, payload) => {
    state.hover = payload
  }),

  hoverTargets: [
    'backgroundColor',
    'backgroundOpacity',
    'borderColor',
    'borderOpacity',
    'boxShadow',
    'gradientColorStops',
    'opacity',
    'rotate',
    'scale',
    'skew',
    'textColor',
    'textDecoration',
    'textOpacity',
    'translate',
  ],
  addHoverTargets: action((state, payload) => {
    state.hoverTargets.concat(payload)
  }),

  focus: false,
  setFocus: action((state, payload) => {
    state.focus = payload
  }),

  focusTargets: [
    'accessibility',
    'backgroundColor',
    'backgroundOpacity',
    'borderColor',
    'borderOpacity',
    'boxShadow',
    'gradientColorStops',
    'opacity',
    'outline',
    'placeholderColor',
    'placeholderOpacity',
    'ringColor',
    'ringOffsetColor',
    'ringOffsetWidth',
    'ringOpacity',
    'ringWidth',
    'rotate',
    'scale',
    'skew',
    'textColor',
    'textDecoration',
    'textOpacity',
    'translate',
    'zIndex',
  ],
  addFocusTargets: action((state, payload) => {
    state.focusTargets.concat(payload)
  }),

  active: false,
  setActive: action((state, payload) => {
    state.active = payload
  }),
}

export default variantsModel
