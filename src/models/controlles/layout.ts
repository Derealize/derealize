import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants, UpdatePayload } from '.'

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
  updateContainerProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  boxSizingPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateBoxSizingProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  displayPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateDisplayProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  floatPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateFloatProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  objectFitPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateObjectFitProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  objectPositionValues: Computed<LayoutModel, Array<string>, StoreModel>
  objectPositionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateObjectPositionProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  overflowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateOverflowProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  positionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updatePositionProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  insetValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateInsetProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  visibilityPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateVisibilityProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  zindexValues: Computed<LayoutModel, Array<string>, StoreModel>
  zindexPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  updateZindexProperty: Thunk<LayoutModel, UpdatePayload, void, StoreModel>

  allPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<LayoutModel, AlreadyVariants, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter((property) => property.classname === ContainerName),
  ),
  updateContainerProperty: thunk((actions, { method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname: ContainerName, method, targetNames: [ContainerName] })
  }),

  boxSizingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => BoxSizingName.includes(classname)),
  ),
  updateBoxSizingProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetNames: BoxSizingName })
  }),

  displayPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => DisplayName.includes(classname)),
  ),
  updateDisplayProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetNames: DisplayName })
  }),

  floatPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FloatName.includes(classname)),
  ),
  updateFloatProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetNames: FloatName })
  }),

  objectFitPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFit.includes(classname)),
  ),
  updateObjectFitProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetNames: ObjectFit })
  }),

  objectPositionValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.objectPosition)
  }),
  objectPositionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys
      .filter(({ classname }) => !ObjectFit.includes(classname) && classname.startsWith('object-'))
      .map((p) => ({ value: p.classname.replace('object-', ''), ...p })),
  ),
  updatePositionProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetStartName: 'object-' })
  }),

  overflowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => Overflow.includes(classname)),
  ),
  updateOverflowProperty: thunk((actions, { classname, method }, { getStoreActions }) => {
    getStoreActions().controlles.update({ classname, method, targetNames: Overflow })
  }),

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
