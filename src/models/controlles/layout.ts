import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import { storeStateProject } from '../../utils/assest'
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
  // 'inline-table',
  // 'table-caption',
  // 'table-cell',
  // 'table-column',
  // 'table-column-group',
  // 'table-footer-group',
  // 'table-header-group',
  // 'table-row-group',
  // 'table-row',
  'flow-root',
  'grid',
  'inline-grid',
  'contents',
  'list-item',
  'hidden',
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

export const FlexDirectionValues = ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse']
export const FlexWrapValues = ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap']
export const JustifyContentValues = [
  'justify-start',
  'justify-end',
  'justify-center',
  'justify-between',
  'justify-around',
  'justify-evenly',
]
export const AlignItemsValues = ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch']
export const AlignContentValues = [
  'content-center',
  'content-start',
  'content-end',
  'content-between',
  'content-around',
  'content-evenly',
]
export const AlignSelfValues = ['self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch']

export const GridAutoFlowValues = ['grid-flow-row', 'grid-flow-col', 'grid-flow-row-dense', 'grid-flow-col-dense']

export const BoxSizingValues = ['box-border', 'box-content']

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

export interface LayoutModel {
  // #region layout
  containerPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  displayPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectFitPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  objectPositionValues: Computed<LayoutModel, Array<string>, StoreModel>
  objectPositionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  overflowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  positionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  insetSuffix: Computed<LayoutModel, Array<string>, StoreModel>
  // insetValues: Computed<LayoutModel, Array<string>, StoreModel>
  // insetPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  // insetYValues: Computed<LayoutModel, Array<string>, StoreModel>
  // insetYPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  // insetXValues: Computed<LayoutModel, Array<string>, StoreModel>
  // insetXPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
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
  // #endregion

  // #region flex
  flexDirectionPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  flexWrapPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  flexValues: Computed<LayoutModel, Array<string>, StoreModel>
  flexPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  flexGrowValues: Computed<LayoutModel, Array<string>, StoreModel>
  flexGrowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  flexShrinkValues: Computed<LayoutModel, Array<string>, StoreModel>
  flexShrinkPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  orderValues: Computed<LayoutModel, Array<string>, StoreModel>
  orderPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  justifyContentPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alignItemsPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alignContentPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  alignSelfPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  // #endregion

  // #region grid
  templateColsValues: Computed<LayoutModel, Array<string>, StoreModel>
  templateColsPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  templateRowsValues: Computed<LayoutModel, Array<string>, StoreModel>
  templateRowsPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  colSpanValues: Computed<LayoutModel, Array<string>, StoreModel>
  colSpanPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  colStartValues: Computed<LayoutModel, Array<string>, StoreModel>
  colStartPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  colEndValues: Computed<LayoutModel, Array<string>, StoreModel>
  colEndPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  rowSpanValues: Computed<LayoutModel, Array<string>, StoreModel>
  rowSpanPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  rowStartValues: Computed<LayoutModel, Array<string>, StoreModel>
  rowStartPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  rowEndValues: Computed<LayoutModel, Array<string>, StoreModel>
  rowEndPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  autoFlowPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  gapValues: Computed<LayoutModel, Array<string>, StoreModel>
  gapPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  autoColsValues: Computed<LayoutModel, Array<string>, StoreModel>
  autoColsPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  autoRowsValues: Computed<LayoutModel, Array<string>, StoreModel>
  autoRowsPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  // #endregion

  boxSizingPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  floatPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  clearPropertys: Computed<LayoutModel, Array<Property>, StoreModel>
  overscrollPropertys: Computed<LayoutModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<LayoutModel, AlreadyVariants, StoreModel>
}

const layoutModel: LayoutModel = {
  displayPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => DisplayValues.includes(classname)),
  ),

  // #region position
  positionPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => PositionValues.includes(classname)),
  ),

  insetSuffix: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.inset) return []
    return Object.keys(project.tailwindConfig.theme.inset)
  }),
  topValues: computed([(state) => state.insetSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-top-${v.slice(1)}` : `top-${v}`)),
  ),
  topPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.topValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  bottomValues: computed([(state) => state.insetSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-bottom-${v.slice(1)}` : `bottom-${v}`)),
  ),
  bottomPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.bottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  rightValues: computed([(state) => state.insetSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-right-${v.slice(1)}` : `right-${v}`)),
  ),
  rightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.rightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  leftValues: computed([(state) => state.insetSuffix], (suffix) =>
    suffix.map((v) => (v.startsWith('-') ? `-left-${v.slice(1)}` : `left-${v}`)),
  ),
  leftPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.leftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  // #endregion

  // #region flex
  flexDirectionPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => FlexDirectionValues.includes(classname)),
  ),

  flexWrapPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => FlexWrapValues.includes(classname)),
  ),

  flexValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.flex) return []
    return Object.keys(project.tailwindConfig.theme.flex).map((v) => `flex-${v}`)
  }),
  flexPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.flexValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  flexGrowValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.flexGrow) return []
    return Object.keys(project.tailwindConfig.theme.flexGrow).map((v) =>
      v === 'DEFAULT' ? 'flex-grow' : `flex-grow-${v}`,
    )
  }),
  flexGrowPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.flexGrowValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  flexShrinkValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.flexShrink) return []
    return Object.keys(project.tailwindConfig.theme.flexShrink).map((v) =>
      v === 'DEFAULT' ? 'flex-shrink' : `flex-shrink-${v}`,
    )
  }),
  flexShrinkPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.flexShrinkValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  orderValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.order) return []
    return Object.keys(project.tailwindConfig.theme.order).map((v) => `order-${v}`)
  }),
  orderPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.orderValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  justifyContentPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => JustifyContentValues.includes(classname)),
  ),
  alignItemsPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => AlignItemsValues.includes(classname)),
  ),
  alignContentPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => AlignContentValues.includes(classname)),
  ),
  alignSelfPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => AlignSelfValues.includes(classname)),
  ),
  // #endregion

  // #region grid
  templateColsValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridTemplateColumns) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateColumns).map((v) => `grid-cols-${v}`)
  }),
  templateColsPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.templateColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  templateRowsValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridTemplateRows) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateRows).map((v) => `grid-rows-${v}`)
  }),
  templateRowsPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.templateRowsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colSpanValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridColumn) return []
    return Object.keys(project.tailwindConfig.theme.gridColumn).map((v) => `col-span-${v}`)
  }),
  colSpanPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.colSpanValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colStartValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridColumnStart) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnStart).map((v) => `col-start-${v}`)
  }),
  colStartPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colEndValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridColumnEnd) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnEnd).map((v) => `col-end-${v}`)
  }),
  colEndPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowSpanValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridRow) return []
    return Object.keys(project.tailwindConfig.theme.gridRow).map((v) => `row-span-${v}`)
  }),
  rowSpanPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.rowSpanValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowStartValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridRowStart) return []
    return Object.keys(project.tailwindConfig.theme.gridRowStart).map((v) => `row-start-${v}`)
  }),
  rowStartPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.rowStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowEndValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridRowEnd) return []
    return Object.keys(project.tailwindConfig.theme.gridRowEnd).map((v) => `row-end-${v}`)
  }),
  rowEndPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.rowEndValues],
    (propertys, vlaues) => propertys.filter(({ classname }) => vlaues.includes(classname)),
  ),

  autoFlowPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => GridAutoFlowValues.includes(classname)),
  ),

  gapValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gap) return []
    return Object.keys(project.tailwindConfig.theme.gap).map((v) => `gap-${v}`)
  }),
  gapPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.gapValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  autoColsValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridAutoColumns) return []
    return Object.keys(project.tailwindConfig.theme.gridAutoColumns).map((v) => `auto-cols-${v}`)
  }),
  autoColsPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.autoColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  autoRowsValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.gridAutoRows) return []
    return Object.keys(project.tailwindConfig.theme.gridAutoRows).map((v) => `auto-rows-${v}`)
  }),
  autoRowsPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.autoRowsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  // #endregion

  floatPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => FloatValues.includes(classname)),
  ),
  clearPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => ClearValues.includes(classname)),
  ),

  // #region advanced
  visibilityPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => VisibilityValues.includes(classname)),
  ),
  zIndexValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.zIndex) return []
    return Object.keys(project.tailwindConfig.theme.zIndex).map((v) => `z-${v}`)
  }),
  zIndexPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.zIndexValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  boxSizingPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => BoxSizingValues.includes(classname)),
  ),
  containerPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter((property) => property.classname === ContainerValue),
  ),
  objectFitPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => ObjectFitValues.includes(classname)),
  ),
  objectPositionValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.objectPosition) return []
    return Object.keys(project.tailwindConfig.theme.objectPosition).map((v) => `object-${v}`)
  }),
  objectPositionPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.objectPositionValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  overflowPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => OverflowValues.includes(classname)),
  ),
  overscrollPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => OverscrollValues.includes(classname)),
  ),
  // #endregion

  alreadyVariants: computed(
    [
      (state: State<LayoutModel>) => state.displayPropertys,

      (state: State<LayoutModel>) => state.positionPropertys,
      (state: State<LayoutModel>) => state.topPropertys,
      (state: State<LayoutModel>) => state.bottomPropertys,
      (state: State<LayoutModel>) => state.leftPropertys,
      (state: State<LayoutModel>) => state.rightPropertys,

      (state: State<LayoutModel>) => state.flexDirectionPropertys,
      (state: State<LayoutModel>) => state.flexWrapPropertys,
      (state: State<LayoutModel>) => state.flexPropertys,
      (state: State<LayoutModel>) => state.flexGrowPropertys,
      (state: State<LayoutModel>) => state.flexShrinkPropertys,
      (state: State<LayoutModel>) => state.orderPropertys,
      (state: State<LayoutModel>) => state.justifyContentPropertys,
      (state: State<LayoutModel>) => state.alignItemsPropertys,
      (state: State<LayoutModel>) => state.alignContentPropertys,
      (state: State<LayoutModel>) => state.alignSelfPropertys,

      (state: State<LayoutModel>) => state.templateColsPropertys,
      (state: State<LayoutModel>) => state.templateRowsPropertys,
      (state: State<LayoutModel>) => state.colSpanPropertys,
      (state: State<LayoutModel>) => state.colStartPropertys,
      (state: State<LayoutModel>) => state.colEndPropertys,
      (state: State<LayoutModel>) => state.rowSpanPropertys,
      (state: State<LayoutModel>) => state.rowStartPropertys,
      (state: State<LayoutModel>) => state.rowEndPropertys,
      (state: State<LayoutModel>) => state.autoFlowPropertys,
      (state: State<LayoutModel>) => state.gapPropertys,
      (state: State<LayoutModel>) => state.autoColsPropertys,
      (state: State<LayoutModel>) => state.autoRowsPropertys,

      (state: State<LayoutModel>) => state.visibilityPropertys,
      (state: State<LayoutModel>) => state.zIndexPropertys,
      (state: State<LayoutModel>) => state.containerPropertys,
      (state: State<LayoutModel>) => state.objectFitPropertys,
      (state: State<LayoutModel>) => state.objectPositionPropertys,
      (state: State<LayoutModel>) => state.overflowPropertys,
      (state: State<LayoutModel>) => state.boxSizingPropertys,
      (state: State<LayoutModel>) => state.floatPropertys,
      (state: State<LayoutModel>) => state.clearPropertys,
      (state: State<LayoutModel>) => state.overscrollPropertys,
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

export default layoutModel
