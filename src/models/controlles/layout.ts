import { computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from '.'

export const ContainerValue = 'container'
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
export const FloatValues = ['right', 'left', 'none']
export const ClearValues = ['clear-left', 'clear-right', 'clear-none']
export const ObjectFitValues = ['object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down']
export const OverflowValues = [
  'overflow-auto',
  'overflow-hidden',
  'overflow-visible',
  'overflow-scroll',
  'overflow-x-auto',
  'overflow-y-auto',
  'overflow-x-hidden',
  'overflow-y-hidden',
  'overflow-x-visible',
  'overflow-y-visible',
  'overflow-x-scroll',
  'overflow-y-scroll',
]

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

export const PositionValues = ['static', 'fixed', 'absolute', 'relative', 'sticky']
export const InsetPrefixs = ['inset', 'inset-y', 'inset-x', 'top', 'right', 'bottom', 'left']

export const VisibilityValues = ['visible', 'invisible']

export interface LayoutModel {
  containerPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  boxSizingPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  displayPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  floatPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  clearPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectFitPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectPositionValues: Computed<LayoutModel, Array<string>, StoreModel>
  objectPositionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  overflowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  positionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  insetValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  visibilityPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  zindexValues: Computed<LayoutModel, Array<string>, StoreModel>
  zindexPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  allPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<LayoutModel, AlreadyVariants, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter((property) => property.classname === ContainerValue),
  ),

  boxSizingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => BoxSizingValues.includes(classname)),
  ),

  displayPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => DisplayValues.includes(classname)),
  ),

  floatPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FloatValues.includes(classname)),
  ),

  clearPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ClearValues.includes(classname)),
  ),

  objectFitPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFitValues.includes(classname)),
  ),

  objectPositionValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.objectPosition)
  }),
  objectPositionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys
      .filter(({ classname }) => !ObjectFitValues.includes(classname) && classname.startsWith('object-'))
      .map((p) => ({ value: p.classname.replace('object-', ''), ...p })),
  ),

  overflowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => OverflowValues.includes(classname)),
  ),

  positionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => PositionValues.includes(classname)),
  ),

  insetValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.inset)
  }),
  insetPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys
      .filter(({ classname }) => InsetPrefixs.some((prefix) => classname.startsWith(prefix)))
      .map((p) => ({ value: p.classname.split('-').slice(-1)[0], ...p })),
  ),

  visibilityPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => VisibilityValues.includes(classname)),
  ),

  zindexValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.zIndex)
  }),
  zindexPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('z-')),
  ),

  allPropertys: computed(
    ({
      containerPropertys,
      boxSizingPropertys,
      displayPropertys,
      floatPropertys,
      objectFitPropertys,
      objectPositionPropertys,
      overflowPropertys,
      positionPropertys,
      insetPropertys,
      visibilityPropertys,
      zindexPropertys,
    }) => {
      return containerPropertys.concat(
        boxSizingPropertys,
        displayPropertys,
        floatPropertys,
        objectFitPropertys,
        objectPositionPropertys,
        overflowPropertys,
        positionPropertys,
        insetPropertys,
        visibilityPropertys,
        zindexPropertys,
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

export default layoutModel
