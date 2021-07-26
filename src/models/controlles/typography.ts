import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import { storeStateProject } from '../../utils/assest'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'
import type { GroupType } from '../../components/SelectController'
import { buildColorOptions, filterColorPropertys } from '../../utils/color-options'

export const TextAlignValues = ['text-left', 'text-center', 'text-right', 'text-justify']
export const TextDecorationValues = ['underline', 'line-through', 'no-underline']
export const TextTransformValues = ['uppercase', 'lowercase', 'capitalize', 'normal-case']

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

export interface TypographyModel {
  fontFamilyValues: Computed<TypographyModel, Array<string>, StoreModel>
  fontFamilyPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  fontSizeValues: Computed<TypographyModel, Array<string>, StoreModel>
  fontSizePropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  fontWeightValues: Computed<TypographyModel, Array<string>, StoreModel>
  fontWeightPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  letterSpacingValues: Computed<TypographyModel, Array<string>, StoreModel>
  letterSpacingPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  lineHeightValues: Computed<TypographyModel, Array<string>, StoreModel>
  lineHeightPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  placeholderColorValues: Computed<TypographyModel, Array<GroupType>, StoreModel>
  placeholderColorPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  placeholderOpacityValues: Computed<TypographyModel, Array<string>, StoreModel>
  placeholderOpacityPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textAlignPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textColorValues: Computed<TypographyModel, Array<GroupType>, StoreModel>
  textColorPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textOpacityValues: Computed<TypographyModel, Array<string>, StoreModel>
  textOpacityPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textDecorationPropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  textTransformPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  fontSmoothingPropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  fontStylePropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  fontVariantNumericPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  listStylePropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  listStylePositionPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textOverflowPropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  verticalAlignPropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  whitespacePropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  wordBreakPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<TypographyModel, AlreadyVariants, StoreModel>
}

const typographyModel: TypographyModel = {
  fontFamilyValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.fontFamily) return []
    return Object.keys(project.tailwindConfig.theme.fontFamily).map((v) => `font-${v}`)
  }),
  fontFamilyPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.fontFamilyValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  fontSizeValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.fontSize) return []
    return Object.keys(project.tailwindConfig.theme.fontSize).map((v) => `text-${v}`)
  }),
  fontSizePropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.fontSizeValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  fontWeightValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.fontWeight) return []
    return Object.keys(project.tailwindConfig.theme.fontWeight).map((v) => `font-${v}`)
  }),
  fontWeightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.fontWeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  letterSpacingValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.letterSpacing) return []
    return Object.keys(project.tailwindConfig.theme.letterSpacing).map((v) => `tracking-${v}`)
  }),
  letterSpacingPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.letterSpacingValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  lineHeightValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.lineHeight) return []
    return Object.keys(project.tailwindConfig.theme.lineHeight).map((v) => `tracking-${v}`)
  }),
  lineHeightPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.lineHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  placeholderColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.placeholderColor) return []
    return buildColorOptions(project.tailwindConfig.theme.placeholderColor, 'placeholder')
  }),
  placeholderColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.placeholderColorValues],
    filterColorPropertys,
  ),

  placeholderOpacityValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.placeholderOpacity) return []
    const { placeholderOpacity, opacity } = project.tailwindConfig.theme
    return Object.keys(Object.assign(placeholderOpacity, opacity)).map((v) => `placeholder-opacity-${v}`)
  }),
  placeholderOpacityPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.placeholderOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  textAlignPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => TextAlignValues.includes(classname)),
  ),

  textColorValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.textColor) return []
    return buildColorOptions(project.tailwindConfig.theme.textColor, 'text')
  }),
  textColorPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.textColorValues],
    filterColorPropertys,
  ),

  textOpacityValues: computed([storeStateProject], (project) => {
    if (!project?.tailwindConfig?.theme.textOpacity) return []
    return Object.keys(project.tailwindConfig.theme.textOpacity).map((v) => `text-opacity-${v}`)
  }),
  textOpacityPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys, (state) => state.textOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  // #region advanced
  textDecorationPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => TextDecorationValues.includes(classname)),
  ),

  textTransformPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => TextTransformValues.includes(classname)),
  ),

  fontSmoothingPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => FontSmoothingValues.includes(classname)),
  ),

  fontStylePropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => FontStyleValues.includes(classname)),
  ),

  fontVariantNumericPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys],
    (propertys) => propertys.filter(({ classname }) => FontVariantNumericValues.includes(classname)),
  ),

  listStylePropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => ListStyleValues.includes(classname)),
  ),

  listStylePositionPropertys: computed(
    [(state, storeState) => storeState.element.selectedElementPropertys],
    (propertys) => propertys.filter(({ classname }) => ListStylePositionValues.includes(classname)),
  ),

  textOverflowPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => TextOverflowValues.includes(classname)),
  ),
  whitespacePropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => WhitespaceValues.includes(classname)),
  ),

  verticalAlignPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => VerticalAlignValues.includes(classname)),
  ),

  wordBreakPropertys: computed([(state, storeState) => storeState.element.selectedElementPropertys], (propertys) =>
    propertys.filter(({ classname }) => WordBreakValues.includes(classname)),
  ),
  // #endregion

  alreadyVariants: computed(
    [
      (state: State<TypographyModel>) => state.fontFamilyPropertys,
      (state: State<TypographyModel>) => state.fontSizePropertys,
      (state: State<TypographyModel>) => state.fontWeightPropertys,
      (state: State<TypographyModel>) => state.letterSpacingPropertys,
      (state: State<TypographyModel>) => state.lineHeightPropertys,
      (state: State<TypographyModel>) => state.placeholderColorPropertys,
      (state: State<TypographyModel>) => state.placeholderOpacityValues,
      (state: State<TypographyModel>) => state.textAlignPropertys,
      (state: State<TypographyModel>) => state.textColorPropertys,
      (state: State<TypographyModel>) => state.textOpacityPropertys,
      (state: State<TypographyModel>) => state.textDecorationPropertys,

      (state: State<TypographyModel>) => state.fontSmoothingPropertys,
      (state: State<TypographyModel>) => state.fontStylePropertys,
      (state: State<TypographyModel>) => state.fontVariantNumericPropertys,
      (state: State<TypographyModel>) => state.listStylePropertys,
      (state: State<TypographyModel>) => state.listStylePositionPropertys,
      (state: State<TypographyModel>) => state.textOverflowPropertys,
      (state: State<TypographyModel>) => state.whitespacePropertys,
      (state: State<TypographyModel>) => state.verticalAlignPropertys,
      (state: State<TypographyModel>) => state.wordBreakPropertys,
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

export default typographyModel
