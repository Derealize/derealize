import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const TextAlignValues = ['text-left', 'text-center', 'text-right', 'text-justify']
export const TextDecorationValues = ['underline', 'line-through', 'no-underline']
export const TextTransformValues = ['uppercase', 'lowercase', 'capitalize', 'normal-case']

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

  placeholderValues: Computed<TypographyModel, Array<string>, StoreModel>
  placeholderPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  placeholderOpacityValues: Computed<TypographyModel, Array<string>, StoreModel>
  placeholderOpacityPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textAlignPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textColorValues: Computed<TypographyModel, Array<string>, StoreModel>
  textColorPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textOpacityValues: Computed<TypographyModel, Array<string>, StoreModel>
  textOpacityPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  textDecorationPropertys: Computed<TypographyModel, Array<Property>, StoreModel>
  textTransformPropertys: Computed<TypographyModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<TypographyModel, AlreadyVariants, StoreModel>
}

const typographyModel: TypographyModel = {
  fontFamilyValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.fontFamily).map((v) => `font-${v}`)
  }),
  fontFamilyPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.fontFamilyValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  fontSizeValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.fontSize).map((v) => `text-${v}`)
  }),
  fontSizePropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.fontSizeValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  fontWeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.fontWeight).map((v) => `font-${v}`)
  }),
  fontWeightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.fontWeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  letterSpacingValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.letterSpacing).map((v) => `tracking-${v}`)
  }),
  letterSpacingPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.letterSpacingValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  lineHeightValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.lineHeight).map((v) => `tracking-${v}`)
  }),
  lineHeightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.lineHeightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  placeholderValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.placeholderColor).map((v) => `placeholder-${v}`)
  }),
  placeholderPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.placeholderValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  placeholderOpacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { placeholderOpacity, opacity } = project.tailwindConfig.theme
    return Object.keys(Object.assign(placeholderOpacity, opacity)).map((v) => `placeholder-opacity-${v}`)
  }),
  placeholderOpacityPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.placeholderOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  textAlignPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => TextAlignValues.includes(classname)),
  ),

  textColorValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.textColor).map((v) => `text-${v}`)
  }),
  textColorPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.textColorValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  textOpacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { textOpacity, opacity } = project.tailwindConfig.theme
    return Object.keys(Object.assign(textOpacity, opacity)).map((v) => `text-opacity-${v}`)
  }),
  textOpacityPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.textOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  textDecorationPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => TextDecorationValues.includes(classname)),
  ),

  textTransformPropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => TextTransformValues.includes(classname)),
  ),

  alreadyVariants: computed(
    [
      (state: State<TypographyModel>) => state.fontFamilyPropertys,
      (state: State<TypographyModel>) => state.fontSizePropertys,
      (state: State<TypographyModel>) => state.fontWeightPropertys,
      (state: State<TypographyModel>) => state.letterSpacingPropertys,
      (state: State<TypographyModel>) => state.lineHeightPropertys,
      (state: State<TypographyModel>) => state.placeholderPropertys,
      (state: State<TypographyModel>) => state.placeholderOpacityValues,
      (state: State<TypographyModel>) => state.textAlignPropertys,
      (state: State<TypographyModel>) => state.textColorPropertys,
      (state: State<TypographyModel>) => state.textOpacityPropertys,
      (state: State<TypographyModel>) => state.textDecorationPropertys,
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

export default typographyModel