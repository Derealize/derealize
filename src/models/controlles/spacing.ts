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

  paddingValues: Computed<SpacingModel, Array<string>, StoreModel>
  paddingPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  marginValues: Computed<SpacingModel, Array<string>, StoreModel>
  marginPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  spaceBetweenValues: Computed<SpacingModel, Array<string>, StoreModel>
  spaceBetweenPropertys: Computed<SpacingModel, Array<Property>, StoreModel>

  allPropertys: Computed<SpacingModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<SpacingModel, AlreadyVariants, StoreModel>
}

const spacingModel: SpacingModel = {
  widthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, width } = project.tailwindConfig.theme
    return Object.keys(Object.assign(width, spacing))
  }),
  widthPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('w-')),
  ),

  minWidthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, minWidth } = project.tailwindConfig.theme
    return Object.keys(Object.assign(minWidth, spacing))
  }),
  minWidthPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('min-w-')),
  ),

  maxWidthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, maxWidth } = project.tailwindConfig.theme
    return Object.keys(Object.assign(maxWidth, spacing))
  }),
  maxWidthPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('max-w-')),
  ),

  heightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, height } = project.tailwindConfig.theme
    return Object.keys(Object.assign(height, spacing))
  }),
  heightPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('h-')),
  ),

  minHeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, minHeight } = project.tailwindConfig.theme
    return Object.keys(Object.assign(minHeight, spacing))
  }),
  minHeightPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('min-h-')),
  ),

  maxHeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, maxHeight } = project.tailwindConfig.theme
    return Object.keys(Object.assign(maxHeight, spacing))
  }),
  maxHeightPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('max-h-')),
  ),

  paddingValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, padding } = project.tailwindConfig.theme
    return Object.keys(Object.assign(padding, spacing))
  }),
  paddingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('p-')),
  ),

  marginValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, margin } = project.tailwindConfig.theme
    return Object.keys(Object.assign(margin, spacing))
  }),
  marginPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('m-')),
  ),

  spaceBetweenValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, space } = project.tailwindConfig.theme
    return Object.keys(Object.assign(space, spacing))
  }),
  spaceBetweenPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('space-')),
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
      marginPropertys,
      spaceBetweenPropertys
    }) => {
      return paddingPropertys.concat(
        widthPropertys,
        minWidthPropertys,
        maxWidthPropertys,
        heightPropertys,
        minHeightPropertys,
        maxHeightPropertys,
        marginPropertys,
        spaceBetweenPropertys
      )
    }
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
