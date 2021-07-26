import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import { storeStateProject } from '../../utils/assest'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'
import type { GroupType } from '../../components/SelectController'
import { buildColorOptions, filterColorPropertys } from '../../utils/color-options'

export const BackgroundAttachmentValues = ['bg-fixed', 'bg-local', 'bg-scroll']
export const BackgroundClipValues = ['bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text']
export const BackgroundRepeatValues = [
  'bg-repeat	',
  'bg-no-repeat	',
  'bg-repeat-x	',
  'bg-repeat-y',
  'bg-repeat-round',
  'bg-repeat-space',
]

export interface BackgroundModel {
  backgroundAttachmentPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundClipPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundColorValues: Computed<BackgroundModel, Array<GroupType>, StoreModel>
  backgroundColorPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundOpacityValues: Computed<BackgroundModel, Array<string>, StoreModel>
  backgroundOpacityPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundPositionValues: Computed<BackgroundModel, Array<string>, StoreModel>
  backgroundPositionPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundRepeatPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundSizeValues: Computed<BackgroundModel, Array<string>, StoreModel>
  backgroundSizePropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  backgroundImageValues: Computed<BackgroundModel, Array<string>, StoreModel>
  backgroundImagePropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  fromColorValues: Computed<BackgroundModel, Array<GroupType>, StoreModel>
  fromColorPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  viaColorValues: Computed<BackgroundModel, Array<GroupType>, StoreModel>
  viaColorPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  toColorValues: Computed<BackgroundModel, Array<GroupType>, StoreModel>
  toColorPropertys: Computed<BackgroundModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<BackgroundModel, AlreadyVariants, StoreModel>
}

const backgroundModel: BackgroundModel = {
  backgroundAttachmentPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys],
    (propertys) => propertys.filter(({ classname }) => BackgroundAttachmentValues.includes(classname)),
  ),

  backgroundClipPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => BackgroundClipValues.includes(classname)),
  ),

  backgroundColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.backgroundColor) return []
    return buildColorOptions(project.tailwindConfig.theme.backgroundColor, 'bg')
  }),
  backgroundColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.backgroundColorValues],
    filterColorPropertys,
  ),

  backgroundOpacityValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.backgroundOpacity) return []
    return Object.keys(project.tailwindConfig.theme.backgroundOpacity).map((v) => `bg-opacity-${v}`)
  }),
  backgroundOpacityPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.backgroundOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  backgroundPositionValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.backgroundPosition) return []
    return Object.keys(project.tailwindConfig.theme.backgroundPosition).map((v) => `bg-${v}`)
  }),
  backgroundPositionPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.backgroundPositionValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  backgroundRepeatPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys],
    (propertys) => propertys.filter(({ classname }) => BackgroundRepeatValues.includes(classname)),
  ),

  backgroundSizeValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.backgroundSize) return []
    return Object.keys(project.tailwindConfig.theme.backgroundSize).map((v) => `bg-${v}`)
  }),
  backgroundSizePropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.backgroundSizeValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  backgroundImageValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.backgroundImage) return []
    return Object.keys(project.tailwindConfig.theme.backgroundImage).map((v) => `bg-${v}`)
  }),
  backgroundImagePropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.backgroundImageValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  fromColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gradientColorStops) return []
    return buildColorOptions(project.tailwindConfig.theme.gradientColorStops, 'from')
  }),
  fromColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.fromColorValues],
    filterColorPropertys,
  ),

  viaColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gradientColorStops) return []
    return buildColorOptions(project.tailwindConfig.theme.gradientColorStops, 'via')
  }),
  viaColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.viaColorValues],
    filterColorPropertys,
  ),

  toColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gradientColorStops) return []
    return buildColorOptions(project.tailwindConfig.theme.gradientColorStops, 'to')
  }),
  toColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.toColorValues],
    filterColorPropertys,
  ),

  alreadyVariants: computed(
    [
      (state: State<BackgroundModel>) => state.backgroundAttachmentPropertys,
      (state: State<BackgroundModel>) => state.backgroundClipPropertys,
      (state: State<BackgroundModel>) => state.backgroundColorPropertys,
      (state: State<BackgroundModel>) => state.backgroundOpacityPropertys,
      (state: State<BackgroundModel>) => state.backgroundPositionPropertys,
      (state: State<BackgroundModel>) => state.backgroundRepeatPropertys,
      (state: State<BackgroundModel>) => state.backgroundSizePropertys,
      (state: State<BackgroundModel>) => state.backgroundImagePropertys,
      (state: State<BackgroundModel>) => state.fromColorPropertys,
      (state: State<BackgroundModel>) => state.viaColorPropertys,
      (state: State<BackgroundModel>) => state.toColorPropertys,
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
        hasDark: allPropertys.some((property) => property.dark),
        hasNone: allPropertys.some(
          (property) => !property.screen && !property.state && !property.list && !property.custom && !property.dark,
        ),
      }
    },
  ),
}

export default backgroundModel
