import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

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
export const DivideStyleValues = ['divide-solid', 'divide-dashed', 'divide-dotted', 'divide-double', 'divide-none']
export const FontSmoothingValues = ['antialiased', 'subpixel-antialiased']
export const FontStyleValues = ['italic', 'not-italic	']
export const FontVariantNumericValues = [
  'normal-nums	',
  'ordinal',
  'slashed-zero',
  'lining-nums',
  'oldstyle-nums',
  'proportional-nums',
  'tabular-nums',
  'diagonal-fractions',
  'stacked-fractions',
]

export const ListStyleValues = ['list-none', 'list-disc', 'list-decimal']
export const ListStylePositionValues = ['list-inside', 'list-outside']

export const TextOverflowValues = ['truncate', 'overflow-ellipsis', 'overflow-clip']
export const VerticalAlignValues = [
  'align-baseline',
  'align-top',
  'align-middle',
  'align-bottom',
  'align-text-top',
  'align-text-bottom',
]
export const WhitespaceValues = [
  'whitespace-normal',
  'whitespace-nowrap',
  'whitespace-pre',
  'whitespace-pre-line',
  'whitespace-pre-wrap',
]

export const WordBreakValues = ['break-normal', 'break-words', 'break-all']

export interface AdvancedModel {
  overscrollPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  divideSuffix: Computed<AdvancedModel, Array<string>, StoreModel>
  divideYValues: Computed<AdvancedModel, Array<string>, StoreModel>
  divideYPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  divideXValues: Computed<AdvancedModel, Array<string>, StoreModel>
  divideXPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  divideColorValues: Computed<AdvancedModel, Array<string>, StoreModel>
  divideColorPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  divideOpacityValues: Computed<AdvancedModel, Array<string>, StoreModel>
  divideOpacityPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  divideStylePropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  fontSmoothingPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  fontStylePropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  fontVariantNumericPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  listStylePropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  listStylePositionPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  textOverflowPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  verticalAlignPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  whitespacePropertys: Computed<AdvancedModel, Array<Property>, StoreModel>
  wordBreakPropertys: Computed<AdvancedModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<AdvancedModel, AlreadyVariants, StoreModel>
}

const advancedModel: AdvancedModel = {
  overscrollPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => OverscrollValues.includes(classname)),
  ),

  divideSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { divideWidth, borderWidth } = project.tailwindConfig.theme
    return Object.keys(Object.assign(divideWidth, borderWidth))
  }),
  divideYValues: computed([(state) => state.divideSuffix], (divideSuffix) => {
    return divideSuffix.map((v) => (v === 'DEFAULT' ? 'divide-y' : `divide-y-${v}`))
  }),
  divideYPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.divideYValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  divideXValues: computed([(state) => state.divideSuffix], (divideSuffix) => {
    return divideSuffix.map((v) => (v === 'DEFAULT' ? 'divide-x' : `divide-x-${v}`))
  }),
  divideXPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.divideXValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  divideColorValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.divideColor).map((v) => `divide-${v}`)
  }),
  divideColorPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.divideColorValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  divideOpacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.divideOpacity).map((v) => `divide-opacity-${v}`)
  }),
  divideOpacityPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.divideOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  divideStylePropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => DivideStyleValues.includes(classname)),
  ),

  fontSmoothingPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FontSmoothingValues.includes(classname)),
  ),

  fontStylePropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FontStyleValues.includes(classname)),
  ),

  fontVariantNumericPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => FontVariantNumericValues.includes(classname)),
  ),

  listStylePropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ListStyleValues.includes(classname)),
  ),

  listStylePositionPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => ListStylePositionValues.includes(classname)),
  ),

  textOverflowPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => TextOverflowValues.includes(classname)),
  ),
  whitespacePropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => WhitespaceValues.includes(classname)),
  ),

  verticalAlignPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => VerticalAlignValues.includes(classname)),
  ),

  wordBreakPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => WordBreakValues.includes(classname)),
  ),

  alreadyVariants: computed(
    [
      (state: State<AdvancedModel>) => state.overscrollPropertys,
      (state: State<AdvancedModel>) => state.divideYPropertys,
      (state: State<AdvancedModel>) => state.divideXPropertys,
      (state: State<AdvancedModel>) => state.divideColorPropertys,
      (state: State<AdvancedModel>) => state.divideOpacityPropertys,
      (state: State<AdvancedModel>) => state.divideStylePropertys,
      (state: State<AdvancedModel>) => state.fontSmoothingPropertys,
      (state: State<AdvancedModel>) => state.fontStylePropertys,
      (state: State<AdvancedModel>) => state.fontVariantNumericPropertys,
      (state: State<AdvancedModel>) => state.listStylePropertys,
      (state: State<AdvancedModel>) => state.listStylePositionPropertys,
      (state: State<AdvancedModel>) => state.textOverflowPropertys,
      (state: State<AdvancedModel>) => state.whitespacePropertys,
      (state: State<AdvancedModel>) => state.verticalAlignPropertys,
      (state: State<AdvancedModel>) => state.wordBreakPropertys,
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
        dark: allPropertys.some((property) => property.dark),
      }
    },
  ),
}

export default advancedModel
