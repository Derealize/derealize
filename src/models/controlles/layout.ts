import { computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const ContainerValue = 'container'
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
export const ObjectFitValues = ['object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down']
export const OverflowValues = [
  'overflow-auto',
  'overflow-hidden',
  'overflow-visible',
  'overflow-scroll',
  'overflow-x-auto',
  'overflow-x-hidden',
  'overflow-x-visible',
  'overflow-x-scroll',
  'overflow-y-auto',
  'overflow-y-hidden',
  'overflow-y-visible',
  'overflow-y-scroll',
]

export const PositionValues = ['static', 'fixed', 'absolute', 'relative', 'sticky']
export const VisibilityValues = ['visible', 'invisible']

export interface LayoutModel {
  containerPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  displayPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectFitPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectPositionValues: Computed<LayoutModel, Array<string>, StoreModel>
  objectPositionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  overflowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  positionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  insetSuffix: Computed<LayoutModel, Array<string>, StoreModel>
  insetValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  insetYValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetYPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  insetXValues: Computed<LayoutModel, Array<string>, StoreModel>
  insetXPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  topValues: Computed<LayoutModel, Array<string>, StoreModel>
  topPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  bottomValues: Computed<LayoutModel, Array<string>, StoreModel>
  bottomPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  rightValues: Computed<LayoutModel, Array<string>, StoreModel>
  rightPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  leftValues: Computed<LayoutModel, Array<string>, StoreModel>
  leftPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  visibilityPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  zIndexValues: Computed<LayoutModel, Array<string>, StoreModel>
  zIndexPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  allPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<LayoutModel, AlreadyVariants, StoreModel>
}

const layoutModel: LayoutModel = {
  containerPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter((property) => property.classname === ContainerValue),
  ),

  displayPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => DisplayValues.includes(classname)),
  ),

  objectFitPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFitValues.includes(classname)),
  ),

  objectPositionValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.objectPosition).map((v) => `object-${v}`)
  }),
  objectPositionPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.objectPositionValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  overflowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => OverflowValues.includes(classname)),
  ),

  positionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => PositionValues.includes(classname)),
  ),

  insetSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.inset)
  }),
  insetValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `inset-${v}`).concat(insetSuffix.map((v) => `-inset-${v}`))
  }),
  insetPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.insetValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  insetYValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `inset-y-${v}`).concat(insetSuffix.map((v) => `-inset-y-${v}`))
  }),
  insetYPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.insetYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  insetXValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `inset-x-${v}`).concat(insetSuffix.map((v) => `-inset-x-${v}`))
  }),
  insetXPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.insetXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  topValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `top-${v}`).concat(insetSuffix.map((v) => `-top-${v}`))
  }),
  topPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.topValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  bottomValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `bottom-${v}`).concat(insetSuffix.map((v) => `-bottom-${v}`))
  }),
  bottomPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.bottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  rightValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `right-${v}`).concat(insetSuffix.map((v) => `-right-${v}`))
  }),
  rightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  leftValues: computed(({ insetSuffix }) => {
    return insetSuffix.map((v) => `left-${v}`).concat(insetSuffix.map((v) => `-left-${v}`))
  }),
  leftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.leftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  visibilityPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => VisibilityValues.includes(classname)),
  ),

  zIndexValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.zIndex).map((v) => `z-${v}`)
  }),
  zIndexPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.zIndexValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  allPropertys: computed(
    ({
      containerPropertys,
      displayPropertys,
      objectFitPropertys,
      objectPositionPropertys,
      overflowPropertys,
      positionPropertys,
      insetPropertys,
      insetYPropertys,
      insetXPropertys,
      topPropertys,
      bottomPropertys,
      leftPropertys,
      rightPropertys,
      visibilityPropertys,
      zIndexPropertys,
    }) => {
      return containerPropertys.concat(
        displayPropertys,
        objectFitPropertys,
        objectPositionPropertys,
        overflowPropertys,
        positionPropertys,
        insetPropertys,
        insetYPropertys,
        insetXPropertys,
        topPropertys,
        bottomPropertys,
        leftPropertys,
        rightPropertys,
        visibilityPropertys,
        zIndexPropertys,
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
