import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const GridFlowValues = ['grid-flow-row', 'grid-flow-col', 'grid-flow-row-dense', 'grid-flow-col-dense']

export interface GridModel {
  gridColsValues: Computed<GridModel, Array<string>, StoreModel>
  gridColsPropertys: Computed<GridModel, Array<Property>, StoreModel>

  gridRowsValues: Computed<GridModel, Array<string>, StoreModel>
  gridRowsPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colValues: Computed<GridModel, Array<string>, StoreModel>
  colPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colStartValues: Computed<GridModel, Array<string>, StoreModel>
  colStartPropertys: Computed<GridModel, Array<Property>, StoreModel>

  colEndValues: Computed<GridModel, Array<string>, StoreModel>
  colEndPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowValues: Computed<GridModel, Array<string>, StoreModel>
  rowPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowStartValues: Computed<GridModel, Array<string>, StoreModel>
  rowStartPropertys: Computed<GridModel, Array<Property>, StoreModel>

  rowEndValues: Computed<GridModel, Array<string>, StoreModel>
  rowEndPropertys: Computed<GridModel, Array<Property>, StoreModel>

  gridFlowPropertys: Computed<GridModel, Array<Property>, StoreModel>

  allPropertys: Computed<GridModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<GridModel, AlreadyVariants, StoreModel>
}

const gridModel: GridModel = {
  gridColsValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateColumns).map((v) => `grid-cols-${v}`)
  }),
  gridColsPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.gridColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  gridRowsValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridTemplateRows).map((v) => `grid-rows-${v}`)
  }),
  gridRowsPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.gridColsValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumn).map((v) => `col-span-${v}`)
  }),
  colPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colStartValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnStart).map((v) => `col-start-${v}`)
  }),
  colStartPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  colEndValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnEnd).map((v) => `col-end-${v}`)
  }),
  colEndPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.colStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRow).map((v) => `row-span-${v}`)
  }),
  rowPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowStartValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRowStart).map((v) => `row-start-${v}`)
  }),
  rowStartPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowStartValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  rowEndValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridRowEnd).map((v) => `row-end-${v}`)
  }),
  rowEndPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.rowEndValues],
    (propertys, vlaues) => propertys.filter(({ classname }) => vlaues.includes(classname)),
  ),

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
