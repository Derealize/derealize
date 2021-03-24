import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property } from '.'

export const ContainerName = 'container'
export const BoxSizingName = ['box-border', 'box-content']
export const DisplayName = [
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
export const FloatName = ['right', 'left', 'none']
export const ClearName = ['clear-left', 'clear-right', 'clear-none']
export const ObjectFit = ['object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down']
export const Overflow = [
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

export const Overscroll = [
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

export const Position = ['static', 'fixed', 'absolute', 'relative', 'sticky']
export const InsetPrefix = [
  'inset',
  '-inset',
  'inset-y',
  '-inset-y',
  'inset-x',
  '-inset-x',
  'top',
  '-top',
  'right',
  '-right',
  'bottom',
  '-bottom',
  'left',
  '-left',
]

export const Visibility = ['visible', 'invisible']

export interface LayoutModel {
  containerPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  boxSizingPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  displayPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  floatPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectFitPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectPosition: Computed<LayoutModel, Array<string>, StoreModel>
  objectPositionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  overflowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  positionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  insetValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  visibilityPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  zindexValues: Computed<LayoutModel, Array<string>, StoreModel>
  zindexPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  layoutPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  alreadyScreenVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyStateVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyListVariants: Computed<LayoutModel, Array<string>, StoreModel>
  alreadyCustomVariants: Computed<LayoutModel, Array<string>, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter((property) => property.classname === ContainerName),
  ),

  boxSizingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => BoxSizingName.includes(classname)),
  ),

  displayPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => DisplayName.includes(classname)),
  ),

  floatPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FloatName.includes(classname)),
  ),

  objectFitPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFit.includes(classname)),
  ),

  objectPosition: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.objectPosition)
  }),
  objectPositionPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.objectPosition],
    (propertys, objectPosition) => propertys.filter(({ classname }) => objectPosition.includes(classname)),
  ),

  overflowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFit.includes(classname)),
  ),

  positionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => Position.includes(classname)),
  ),

  insetValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.inset)
  }),
  insetPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => InsetPrefix.some((prefix) => classname.startsWith(prefix))),
  ),

  visibilityPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => Visibility.includes(classname)),
  ),

  zindexValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.zIndex)
  }),
  zindexPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('z-')),
  ),

  layoutPropertys: computed(
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

  alreadyScreenVariants: computed(({ layoutPropertys }) => {
    return layoutPropertys.map((property) => property.screen as string)
  }),
  alreadyStateVariants: computed(({ layoutPropertys }) => {
    return layoutPropertys.map((property) => property.state as string)
  }),
  alreadyListVariants: computed(({ layoutPropertys }) => {
    return layoutPropertys.map((property) => property.list as string)
  }),
  alreadyCustomVariants: computed(({ layoutPropertys }) => {
    return layoutPropertys.map((property) => property.custom as string)
  }),
}

export default layoutModel
