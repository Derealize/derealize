import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export interface GridModel {
  gridColsValues: Computed<GridModel, Array<string>, StoreModel>
  gridColsVariants: Computed<GridModel, Array<string>, StoreModel>
  gridColsPropertys: Computed<GridModel, Array<Property>, StoreModel>

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
  gridColsPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('grid-cols-')),
  ),

  colValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumn)
  }),
  colVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumn)
  }),
  colPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(
      ({ classname }) =>
        classname.startsWith('col-') && !classname.startsWith('col-start-') && !classname.startsWith('col-end-'),
    ),
  ),

  colStartValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnStart)
  }),
  colStartVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumnStart)
  }),
  colStartPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('col-start-')),
  ),

  colEndValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.gridColumnEnd)
  }),
  colEndVariants: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.variants.gridColumnEnd)
  }),
  colEndPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('col-end-')),
  ),

  allPropertys: computed(({ gridColsPropertys, colPropertys, colStartPropertys, colEndPropertys }) => {
    return gridColsPropertys.concat(colPropertys, colStartPropertys, colEndPropertys)
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

export default gridModel
