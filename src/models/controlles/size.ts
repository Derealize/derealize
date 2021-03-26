import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants, UpdatePayload } from '.'

export interface SizeModel {
  widthValues: Computed<SizeModel, Array<string>, StoreModel>
  widthPropertys: Computed<SizeModel, Array<Property>, StoreModel>
  updateWidthProperty: Thunk<SizeModel, UpdatePayload, void, StoreModel>

  minWidthValues: Computed<SizeModel, Array<string>, StoreModel>
  minWidthPropertys: Computed<SizeModel, Array<Property>, StoreModel>

  maxWidthValues: Computed<SizeModel, Array<string>, StoreModel>
  maxWidthPropertys: Computed<SizeModel, Array<Property>, StoreModel>

  heightValues: Computed<SizeModel, Array<string>, StoreModel>
  heightPropertys: Computed<SizeModel, Array<Property>, StoreModel>

  minHeightValues: Computed<SizeModel, Array<string>, StoreModel>
  minHeightPropertys: Computed<SizeModel, Array<Property>, StoreModel>

  maxHeightValues: Computed<SizeModel, Array<string>, StoreModel>
  maxHeightPropertys: Computed<SizeModel, Array<Property>, StoreModel>

  allPropertys: Computed<SizeModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<SizeModel, AlreadyVariants, StoreModel>
}

const sizeModel: SizeModel = {
  widthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { spacing, width } = project.tailwindConfig.theme
    return Object.keys(Object.assign(width, spacing))
  }),
  widthPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('w-')),
  ),
  updateWidthProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetStartName: 'w-' })
  }),

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

  allPropertys: computed(
    ({
      widthPropertys,
      minWidthPropertys,
      maxWidthPropertys,
      heightPropertys,
      minHeightPropertys,
      maxHeightPropertys,
    }) => {
      return widthPropertys.concat(
        minWidthPropertys,
        maxWidthPropertys,
        heightPropertys,
        minHeightPropertys,
        maxHeightPropertys,
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

export default sizeModel
