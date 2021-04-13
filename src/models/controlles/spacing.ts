import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
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

  spaceSuffix: Computed<SpacingModel, Array<string>, StoreModel>
  spaceYValues: Computed<SpacingModel, Array<string>, StoreModel>
  spaceYPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  spaceXValues: Computed<SpacingModel, Array<string>, StoreModel>
  spaceXPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  allPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<SpacingModel, AlreadyVariants, StoreModel>
}

const spacingModel: SpacingModel = {
  widthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, width } = project.tailwindConfig.theme
    return Object.keys(Object.assign(width, spacing)).map((v) => `w-${v}`)
  }),
  widthPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.widthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  minWidthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.minWidth).map((v) => `min-w-${v}`)
  }),
  minWidthPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.minWidthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  maxWidthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.minWidth).map((v) => `max-w-${v}`)
  }),
  maxWidthPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.maxWidthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  heightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, height } = project.tailwindConfig.theme
    return Object.keys(Object.assign(height, spacing)).map((v) => `h-${v}`)
  }),
  heightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.heightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  minHeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.minWidth).map((v) => `min-h-${v}`)
  }),
  minHeightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.minHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  maxHeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.minWidth).map((v) => `max-h-${v}`)
  }),
  maxHeightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.maxHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  paddingSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, padding } = project.tailwindConfig.theme
    return Object.keys(Object.assign(padding, spacing))
  }),
  paddingValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `p-${v}`)
  }),
  paddingPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingYValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `py-${v}`)
  }),
  paddingYPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingXValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `px-${v}`)
  }),
  paddingXPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingTopValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `pt-${v}`)
  }),
  paddingTopPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingTopValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingBottomValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `pb-${v}`)
  }),
  paddingBottomPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingBottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingLeftValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `pl-${v}`)
  }),
  paddingLeftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  paddingRightValues: computed(({ paddingSuffix }) => {
    return paddingSuffix.map((v) => `pr-${v}`)
  }),
  paddingRightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.paddingRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  marginSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, margin } = project.tailwindConfig.theme
    return Object.keys(Object.assign(margin, spacing))
  }),
  marginValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `m-${v}`)
  }),
  marginPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginYValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `my-${v}`)
  }),
  marginYPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginXValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `mx-${v}`)
  }),
  marginXPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginTopValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `mt-${v}`)
  }),
  marginTopPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginTopValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginBottomValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `mb-${v}`)
  }),
  marginBottomPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginBottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginLeftValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `ml-${v}`)
  }),
  marginLeftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  marginRightValues: computed(({ marginSuffix }) => {
    return marginSuffix.map((v) => `mr-${v}`)
  }),
  marginRightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.marginRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  spaceSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, space } = project.tailwindConfig.theme
    return Object.keys(Object.assign(space, spacing))
  }),
  spaceYValues: computed(({ spaceSuffix }) => {
    return spaceSuffix.map((v) => `space-y-${v}`).concat(spaceSuffix.map((v) => `-space-y-${v}`))
  }),
  spaceYPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.spaceYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  spaceXValues: computed(({ spaceSuffix }) => {
    return spaceSuffix.map((v) => `space-x-${v}`).concat(spaceSuffix.map((v) => `-space-x-${v}`))
  }),
  spaceXPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.spaceXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  allPropertys: computed(
    ({
      widthPropertys,
      minWidthPropertys,
      maxWidthPropertys,
      heightPropertys,
      minHeightPropertys,
      maxHeightPropertys,
      paddingPropertys,
      paddingYPropertys,
      paddingXPropertys,
      paddingTopPropertys,
      paddingBottomPropertys,
      paddingLeftPropertys,
      paddingRightPropertys,
      marginPropertys,
      marginYPropertys,
      marginXPropertys,
      marginTopPropertys,
      marginBottomPropertys,
      marginLeftPropertys,
      marginRightPropertys,
      spaceYPropertys,
      spaceXPropertys,
    }) => {
      return paddingPropertys.concat(
        widthPropertys,
        minWidthPropertys,
        maxWidthPropertys,
        heightPropertys,
        minHeightPropertys,
        maxHeightPropertys,
        paddingYPropertys,
        paddingXPropertys,
        paddingTopPropertys,
        paddingBottomPropertys,
        paddingLeftPropertys,
        paddingRightPropertys,
        marginPropertys,
        marginYPropertys,
        marginXPropertys,
        marginTopPropertys,
        marginBottomPropertys,
        marginLeftPropertys,
        marginRightPropertys,
        spaceYPropertys,
        spaceXPropertys,
      )
    },
  ),
  alreadyVariants: computed(({ allPropertys }) => {
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
  }),
}

export default spacingModel
