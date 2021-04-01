import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel, AlreadyVariants } from '../index'
import { Property } from './controlles'

export interface SpacingModel {
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

  allPropertys: computed(({ paddingPropertys, marginPropertys, spaceBetweenPropertys }) => {
    return paddingPropertys.concat(marginPropertys, spaceBetweenPropertys)
  }),
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
