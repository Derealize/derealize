import { computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const BoxSizingValues = ['box-border', 'box-content']
export const DisplayValues = [
  'block',
  'inline-block',
  'inline',
  'flex',
  'inline-flex',
  'table',
  'table-caption',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-footer-group',
  'table-header-group',
  'table-row-group',
  'table-row',
]
export const FloatValues = ['float-right', 'float-left', 'float-none']
export const ClearValues = ['clear-left', 'clear-right', 'clear-none']
export const OverscrollValues = [
  'overscroll-auto',
  'overscroll-contain',
  'overscroll-none',
  'overscroll-y-auto',
  'overscroll-y-contain',
  'overscroll-y-none',
  'overscroll-x-auto',
  'overscroll-x-contain',
  'overscroll-x-none',
]

export interface AdvancedModel {
  boxSizingPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  floatPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  clearPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  overscrollPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  allPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<AdvancedModel, AlreadyVariants, StoreModel>
}

const advancedModel: AdvancedModel = {
  boxSizingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => BoxSizingValues.includes(classname)),
  ),

  floatPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FloatValues.includes(classname)),
  ),

  clearPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ClearValues.includes(classname)),
  ),

  overscrollPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => OverscrollValues.includes(classname)),
  ),

  allPropertys: computed(({ boxSizingPropertys, floatPropertys, clearPropertys, overscrollPropertys }) => {
    return boxSizingPropertys.concat(floatPropertys, clearPropertys, overscrollPropertys)
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

export default advancedModel
