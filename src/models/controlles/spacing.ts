import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import { storeStateProject } from '../../utils/store-assest'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export interface SpacingModel {
  widthValues: Computed<SpacingModel, Array<string>, StoreModel>
  widthPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  minWidthValues: Computed<SpacingModel, Array<string>, StoreModel>
  minWidthPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  maxWidthValues: Computed<SpacingModel, Array<string>, StoreModel>
  maxWidthPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  heightValues: Computed<SpacingModel, Array<string>, StoreModel>
  heightPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  minHeightValues: Computed<SpacingModel, Array<string>, StoreModel>
  minHeightPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  maxHeightValues: Computed<SpacingModel, Array<string>, StoreModel>
  maxHeightPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  marginSuffix: Computed<SpacingModel, Array<string>, StoreModel>
  marginValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginYValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginYPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginXValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginXPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginTopValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginTopPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginBottomValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginBottomPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginLeftValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginLeftPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  marginRightValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginRightPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  paddingSuffix: Computed<SpacingModel, Array<string>, StoreModel>
  paddingValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingYValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingYPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingXValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingXPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingTopValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingTopPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingBottomValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingBottomPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingLeftValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingLeftPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  paddingRightValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingRightPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  spaceSuffix: Computed<SpacingModel, Array<string>, StoreModel>
  spaceYValues: Computed<SpacingModel, Array<string>, StoreModel>
  spaceYPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  spaceXValues: Computed<SpacingModel, Array<string>, StoreModel>
  spaceXPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<SpacingModel, AlreadyVariants, StoreModel>
}

const spacingModel: SpacingModel = {
  widthValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.width) return []
    return Object.keys(project.tailwindConfig.theme.width).map((v) => `w-${v}`)
  }),
  widthPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.widthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  minWidthValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.minWidth) return []
    return Object.keys(project.tailwindConfig.theme.minWidth).map((v) => `min-w-${v}`)
  }),
  minWidthPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.minWidthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  maxWidthValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.maxWidth) return []
    return Object.keys(project.tailwindConfig.theme.maxWidth).map((v) => `max-w-${v}`)
  }),
  maxWidthPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.maxWidthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  heightValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.height) return []
    return Object.keys(project.tailwindConfig.theme.height).map((v) => `h-${v}`)
  }),
  heightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.heightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  minHeightValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.minHeight) return []
    return Object.keys(project.tailwindConfig.theme.minHeight).map((v) => `min-h-${v}`)
  }),
  minHeightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.minHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  maxHeightValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.maxHeight) return []
    return Object.keys(project.tailwindConfig.theme.maxHeight).map((v) => `max-h-${v}`)
  }),
  maxHeightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.maxHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  marginSuffix: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.margin) return []
    return Object.keys(project.tailwindConfig.theme.margin)
  }),
  marginValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-m-${v.slice(1)}` : `m-${v}`)),
  ),
  marginPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginYValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-my-${v.slice(1)}` : `my-${v}`)),
  ),
  marginYPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginXValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-mx-${v.slice(1)}` : `mx-${v}`)),
  ),
  marginXPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginTopValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-mt-${v.slice(1)}` : `mt-${v}`)),
  ),
  marginTopPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginTopValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginBottomValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-mb-${v.slice(1)}` : `mb-${v}`)),
  ),
  marginBottomPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginBottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginLeftValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-ml-${v.slice(1)}` : `ml-${v}`)),
  ),
  marginLeftPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginRightValues: computed([(state) => state.marginSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-mr-${v.slice(1)}` : `mr-${v}`)),
  ),
  marginRightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.marginRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  paddingSuffix: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.padding) return []
    return Object.keys(project.tailwindConfig.theme.padding)
  }),
  paddingValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-p-${v.slice(1)}` : `p-${v}`)),
  ),
  paddingPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingYValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-py-${v.slice(1)}` : `py-${v}`)),
  ),
  paddingYPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingXValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-px-${v.slice(1)}` : `px-${v}`)),
  ),
  paddingXPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingTopValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-pt-${v.slice(1)}` : `pt-${v}`)),
  ),
  paddingTopPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingTopValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingBottomValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-pb-${v.slice(1)}` : `pb-${v}`)),
  ),
  paddingBottomPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingBottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingLeftValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-pl-${v.slice(1)}` : `pl-${v}`)),
  ),
  paddingLeftPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingRightValues: computed([(state) => state.paddingSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-pr-${v.slice(1)}` : `pr-${v}`)),
  ),
  paddingRightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.paddingRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  spaceSuffix: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.space) return []
    return Object.keys(project.tailwindConfig.theme.space)
  }),
  spaceYValues: computed([(state) => state.spaceSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-space-y-${v.slice(1)}` : `space-y-${v}`)),
  ),
  spaceYPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.spaceYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  spaceXValues: computed([(state) => state.spaceSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-space-x-${v.slice(1)}` : `space-x-${v}`)),
  ),
  spaceXPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.spaceXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  alreadyVariants: computed(
    [
      (state: State<SpacingModel>) => state.widthPropertys,
      (state: State<SpacingModel>) => state.minWidthPropertys,
      (state: State<SpacingModel>) => state.maxWidthPropertys,
      (state: State<SpacingModel>) => state.heightPropertys,
      (state: State<SpacingModel>) => state.minHeightPropertys,
      (state: State<SpacingModel>) => state.maxHeightPropertys,
      (state: State<SpacingModel>) => state.paddingPropertys,
      (state: State<SpacingModel>) => state.paddingYPropertys,
      (state: State<SpacingModel>) => state.paddingXPropertys,
      (state: State<SpacingModel>) => state.paddingTopPropertys,
      (state: State<SpacingModel>) => state.paddingBottomPropertys,
      (state: State<SpacingModel>) => state.paddingLeftPropertys,
      (state: State<SpacingModel>) => state.paddingRightPropertys,
      (state: State<SpacingModel>) => state.marginPropertys,
      (state: State<SpacingModel>) => state.marginYPropertys,
      (state: State<SpacingModel>) => state.marginXPropertys,
      (state: State<SpacingModel>) => state.marginTopPropertys,
      (state: State<SpacingModel>) => state.marginBottomPropertys,
      (state: State<SpacingModel>) => state.marginLeftPropertys,
      (state: State<SpacingModel>) => state.marginRightPropertys,
      (state: State<SpacingModel>) => state.spaceYPropertys,
      (state: State<SpacingModel>) => state.spaceXPropertys,
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

export default spacingModel
