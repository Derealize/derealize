import { Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from '.'

export const FlexDirection = ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse']
export const FlexWrap = ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap']
export const JustifyContent = [
  'justify-start',
  'justify-end',
  'justify-center',
  'justify-between',
  'justify-around',
  'justify-evenly',
]
export const AlignItems = ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch']
export const AlignContent = [
  'content-center',
  'content-start',
  'content-end',
  'content-between',
  'content-around',
  'content-evenly',
]
export const AlignSelf = ['self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch']

export interface FlexModel {
  flexDirectionPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  flexWrapPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  flexValues: Computed<FlexModel, Array<string>, StoreModel>
  flexPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  flexGrowValues: Computed<FlexModel, Array<string>, StoreModel>
  flexGrowPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  flexShrinkValues: Computed<FlexModel, Array<string>, StoreModel>
  flexShrinkPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  orderValues: Computed<FlexModel, Array<string>, StoreModel>
  orderPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  justifyContentPropertys: Computed<FlexModel, Array<Property>, StoreModel>
  alignItemsPropertys: Computed<FlexModel, Array<Property>, StoreModel>
  alignContentPropertys: Computed<FlexModel, Array<Property>, StoreModel>
  alignSelfPropertys: Computed<FlexModel, Array<Property>, StoreModel>

  allPropertys: Computed<FlexModel, Array<Property>, StoreModel>
  alreadyVariants: Computed<FlexModel, AlreadyVariants, StoreModel>
}

const flexModel: FlexModel = {
  flexDirectionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FlexDirection.includes(classname)),
  ),

  flexWrapPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FlexWrap.includes(classname)),
  ),

  flexValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.flex)
  }),
  flexPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('flex-')),
  ),

  flexGrowValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.flexGrow)
  }),
  flexGrowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('flex-grow-')),
  ),

  flexShrinkValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.flexShrink)
  }),
  flexShrinkPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('flex-shrink-')),
  ),

  orderValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.order)
  }),
  orderPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => classname.startsWith('order-')),
  ),

  justifyContentPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => JustifyContent.includes(classname)),
  ),
  alignItemsPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => AlignItems.includes(classname)),
  ),
  alignContentPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => AlignContent.includes(classname)),
  ),
  alignSelfPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => AlignSelf.includes(classname)),
  ),

  allPropertys: computed(
    ({
      flexDirectionPropertys,
      flexWrapPropertys,
      flexPropertys,
      flexGrowPropertys,
      flexShrinkPropertys,
      orderPropertys,
      justifyContentPropertys,
      alignItemsPropertys,
      alignContentPropertys,
      alignSelfPropertys,
    }) => {
      return flexDirectionPropertys.concat(
        flexWrapPropertys,
        flexPropertys,
        flexGrowPropertys,
        flexShrinkPropertys,
        orderPropertys,
        justifyContentPropertys,
        alignItemsPropertys,
        alignContentPropertys,
        alignSelfPropertys,
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

export default flexModel
