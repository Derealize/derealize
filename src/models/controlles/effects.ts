import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const MixBlendValues = [
  'mix-blend-normal',
  'mix-blend-multiply',
  'mix-blend-screen',
  'mix-blend-overlay',
  'mix-blend-darken',
  'mix-blend-lighten',
  'mix-blend-color-dodge',
  'mix-blend-color-burn',
  'mix-blend-hard-light',
  'mix-blend-soft-light',
  'mix-blend-difference',
  'mix-blend-exclusion',
  'mix-blend-hue',
  'mix-blend-saturation',
  'mix-blend-color',
  'mix-blend-luminosity',
]

export const BackgroundBlendValues = [
  'bg-blend-normal',
  'bg-blend-multiply',
  'bg-blend-screen',
  'bg-blend-overlay',
  'bg-blend-darken',
  'bg-blend-lighten',
  'bg-blend-color-dodge',
  'bg-blend-color-burn',
  'bg-blend-hard-light',
  'bg-blend-soft-light',
  'bg-blend-difference',
  'bg-blend-exclusion',
  'bg-blend-hue',
  'bg-blend-saturation',
  'bg-blend-color',
  'bg-blend-luminosity',
]

export const TransformValues = ['transform', 'transform-gpu', 'transform-none']

export interface EffectsModel {
  boxShadowValues: Computed<EffectsModel, Array<string>, StoreModel>
  boxShadowPropertys: Computed<EffectsModel, Array<Property>, StoreModel>

  opacityValues: Computed<EffectsModel, Array<string>, StoreModel>
  opacityPropertys: Computed<EffectsModel, Array<Property>, StoreModel>

  transitionValues: Computed<EffectsModel, Array<string>, StoreModel>
  transitionPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  durationValues: Computed<EffectsModel, Array<string>, StoreModel>
  durationPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  easeValues: Computed<EffectsModel, Array<string>, StoreModel>
  easePropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  delayValues: Computed<EffectsModel, Array<string>, StoreModel>
  delayPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  animateValues: Computed<EffectsModel, Array<string>, StoreModel>
  animatePropertys: Computed<EffectsModel, Array<Property>, StoreModel>

  transformPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  originValues: Computed<EffectsModel, Array<string>, StoreModel>
  originPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  scaleValues: Computed<EffectsModel, Array<string>, StoreModel>
  scalePropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  rotateValues: Computed<EffectsModel, Array<string>, StoreModel>
  rotatePropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  translateSuffix: Computed<EffectsModel, Array<string>, StoreModel>
  translateYValues: Computed<EffectsModel, Array<string>, StoreModel>
  translateYPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  translateXValues: Computed<EffectsModel, Array<string>, StoreModel>
  translateXPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  skewSuffix: Computed<EffectsModel, Array<string>, StoreModel>
  skewYValues: Computed<EffectsModel, Array<string>, StoreModel>
  skewYPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  skewXValues: Computed<EffectsModel, Array<string>, StoreModel>
  skewXPropertys: Computed<EffectsModel, Array<Property>, StoreModel>

  mixBlendPropertys: Computed<EffectsModel, Array<Property>, StoreModel>
  backgroundBlendPropertys: Computed<EffectsModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<EffectsModel, AlreadyVariants, StoreModel>
}

const effectsModel: EffectsModel = {
  boxShadowValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.boxShadow).map((v) => (v === 'DEFAULT' ? 'shadow' : `shadow-${v}`))
  }),
  boxShadowPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.boxShadowValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  opacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.opacity).map((v) => `opacity-${v}`)
  }),
  opacityPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.opacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  // #region transition
  transitionValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.transitionProperty).map((v) =>
      v === 'DEFAULT' ? 'transition' : `transition-${v}`,
    )
  }),
  transitionPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.transitionValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  durationValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.transitionDuration).map((v) => `duration-${v}`)
  }),
  durationPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.durationValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  easeValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.transitionTimingFunction).map((v) => `ease-${v}`)
  }),
  easePropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.easeValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  delayValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.transitionDelay).map((v) => `delay-${v}`)
  }),
  delayPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.delayValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  // #endregion

  animateValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.animation).map((v) => `animate-${v}`)
  }),
  animatePropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.animateValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  // #region transform
  transformPropertys: computed([(state, storeState) => storeState.element.activePropertys], (propertys) =>
    propertys.filter(({ classname }) => TransformValues.includes(classname)),
  ),

  originValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.transformOrigin).map((v) => `origin-${v}`)
  }),
  originPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.originValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  scaleValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.scale).map((v) => `scale-${v}`)
  }),
  scalePropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.scaleValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rotateValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.scale).map((v) =>
      v.startsWith('-') ? `-rotate-${v.slice(1)}` : `rotate-${v}`,
    )
  }),
  rotatePropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.rotateValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  translateSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.translate)
  }),
  translateYValues: computed([(state) => state.translateSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-translate-y-${v.slice(1)}` : `translate-y-${v}`)),
  ),
  translateYPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.translateYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  translateXValues: computed([(state) => state.translateSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-translate-x-${v.slice(1)}` : `translate-x-${v}`)),
  ),
  translateXPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.translateXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  skewSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.skew)
  }),
  skewYValues: computed([(state) => state.skewSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-skew-y-${v.slice(1)}` : `skew-y-${v}`)),
  ),
  skewYPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.skewYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  skewXValues: computed([(state) => state.skewSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-skew-x-${v.slice(1)}` : `skew-x-${v}`)),
  ),
  skewXPropertys: computed(
    [(state, storeState) => storeState.element.activePropertys, (state) => state.skewXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  // #endregion

  // #region advanced
  mixBlendPropertys: computed([(state, storeState) => storeState.element.activePropertys], (propertys) =>
    propertys.filter(({ classname }) => MixBlendValues.includes(classname)),
  ),

  backgroundBlendPropertys: computed([(state, storeState) => storeState.element.activePropertys], (propertys) =>
    propertys.filter(({ classname }) => BackgroundBlendValues.includes(classname)),
  ),
  // #endregion

  alreadyVariants: computed(
    [
      (state: State<EffectsModel>) => state.boxShadowPropertys,
      (state: State<EffectsModel>) => state.opacityPropertys,

      (state: State<EffectsModel>) => state.transitionPropertys,
      (state: State<EffectsModel>) => state.durationPropertys,
      (state: State<EffectsModel>) => state.easePropertys,
      (state: State<EffectsModel>) => state.delayPropertys,
      (state: State<EffectsModel>) => state.animatePropertys,

      (state: State<EffectsModel>) => state.transformPropertys,
      (state: State<EffectsModel>) => state.originPropertys,
      (state: State<EffectsModel>) => state.scalePropertys,
      (state: State<EffectsModel>) => state.rotatePropertys,
      (state: State<EffectsModel>) => state.translateYPropertys,
      (state: State<EffectsModel>) => state.translateXPropertys,
      (state: State<EffectsModel>) => state.skewYPropertys,
      (state: State<EffectsModel>) => state.skewXPropertys,

      (state: State<EffectsModel>) => state.mixBlendPropertys,
      (state: State<EffectsModel>) => state.backgroundBlendPropertys,
    ] as any,
    (...propertys: Array<Property[]>) => {
      const allPropertys = flatten(propertys)

      const screens = allPropertys.filter((property) => property.screen).map((property) => property.screen as string)
      const states = allPropertys.filter((property) => property.state).map((property) => property.state as string)
      const lists = allPropertys.filter((property) => property.list).map((property) => property.list as string)
      const customs = allPropertys.filter((property) => property.custom).map((property) => property.custom as string)
      return {
        screens: [...new Set(screens)],
        states: [...new Set(states)],
        lists: [...new Set(lists)],
        customs: [...new Set(customs)],
        dark: allPropertys.some((property) => property.dark),
      }
    },
  ),
}

export default effectsModel
