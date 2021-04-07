import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const GridFlowValues = ['grid-flow-row', 'grid-flow-col', 'grid-flow-row-dense', 'grid-flow-col-dense']

export interface GridModel {
  gridColsValues: Computed<GridModel, Array<string>, StoreModel>
  gridColsVariants: Computed<GridModel, Array<string>, StoreModel>
  gridColsPropertys: Computed<GridModel, Array<Property>, StoreModel>

  gridRowsValues: Computed<GridModel, Array<string>, StoreModel>
  gridRowsVariants: Computed<GridModel, Array<string>, StoreModel>
  gridRowsPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colValues: Computed<GridModel, Array<string>, StoreModel>
  colVariants: Computed<GridModel, Array<string>, StoreModel>
  colPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colStartValues: Computed<GridModel, Array<string>, StoreModel>
  colStartVariants: Computed<GridModel, Array<string>, StoreModel>
  colStartPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colEndValues: Computed<GridModel, Array<string>, StoreModel>
  colEndVariants: Computed<GridModel, Array<string>, StoreModel>
  colEndPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowValues: Computed<GridModel, Array<string>, StoreModel>
  rowVariants: Computed<GridModel, Array<string>, StoreModel>
  rowPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowStartValues: Computed<GridModel, Array<string>, StoreModel>
  rowStartVariants: Computed<GridModel, Array<string>, StoreModel>
  rowStartPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowEndValues: Computed<GridModel, Array<string>, StoreModel>
  rowEndVariants: Computed<GridModel, Array<string>, StoreModel>
  rowEndPropertys: Computed<GridModel, Array<Property>, StoreModel>

  gridFlowVariants: Computed<GridModel, Array<string>, StoreModel>
  gridFlowPropertys: Computed<GridModel, Array<Property>, StoreModel>

  allPropertys: Computed<GridModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<GridModel, AlreadyVariants, StoreModel>
}

const gridModel: GridModel = {
  gridColsValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateColumns)
  }),
  gridColsVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridTemplateColumns)
  }),
  gridColsPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.gridColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  gridRowsValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateRows)
  }),
  gridRowsVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridTemplateRows)
  }),
  gridRowsPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.gridColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumn)
  }),
  colVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumn)
  }),
  colPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colStartValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnStart)
  }),
  colStartVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumnStart)
  }),
  colStartPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colEndValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnEnd)
  }),
  colEndVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumnEnd)
  }),
  colEndPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRow)
  }),
  rowVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridRow)
  }),
  rowPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowStartValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRowStart)
  }),
  rowStartVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridRowStart)
  }),
  rowStartPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowEndValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRowEnd)
  }),
  rowEndVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridRowEnd)
  }),
  rowEndPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowEndValues],
    (propertys, vlaues) => propertys.filter(({ classname }) => vlaues.includes(classname)),
  ),

  gridFlowVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridAutoFlow)
  }),
  gridFlowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => GridFlowValues.includes(classname)),
  ),

  allPropertys: computed(
    ({
      gridColsPropertys,
      gridRowsPropertys,
      colPropertys,
      colStartPropertys,
      colEndPropertys,
      rowPropertys,
      rowStartPropertys,
      rowEndPropertys,
      gridFlowPropertys,
    }) => {
      return gridColsPropertys.concat(
        gridRowsPropertys,
        colPropertys,
        colStartPropertys,
        colEndPropertys,
        rowPropertys,
        rowStartPropertys,
        rowEndPropertys,
        gridFlowPropertys,
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

export default gridModel
