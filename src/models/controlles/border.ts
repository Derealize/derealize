import { computed, Computed, State } from 'easy-peasy'
import flatten from 'lodash.flatten'
import type { StoreModel } from '../index'
import { Property, AlreadyVariants } from './controlles'

export const BorderStyleValues = ['border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none']
export const DivideStyleValues = ['divide-solid', 'divide-dashed', 'divide-dotted', 'divide-double', 'divide-none']

export interface BorderModel {
  roundedSuffix: Computed<BorderModel, Array<string>, StoreModel>
  roundedValues: Computed<BorderModel, Array<string>, StoreModel>
  roundedPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  roundedTopLeftValues: Computed<BorderModel, Array<string>, StoreModel>
  roundedTopLeftPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  roundedTopRightValues: Computed<BorderModel, Array<string>, StoreModel>
  roundedTopRightPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  roundedBottomLeftValues: Computed<BorderModel, Array<string>, StoreModel>
  roundedBottomLeftPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  roundedBottomRightValues: Computed<BorderModel, Array<string>, StoreModel>
  roundedBottomRightPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  borderSuffix: Computed<BorderModel, Array<string>, StoreModel>
  borderValues: Computed<BorderModel, Array<string>, StoreModel>
  borderPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  borderTopValues: Computed<BorderModel, Array<string>, StoreModel>
  borderTopPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  borderBottomValues: Computed<BorderModel, Array<string>, StoreModel>
  borderBottomPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  borderLeftValues: Computed<BorderModel, Array<string>, StoreModel>
  borderLeftPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  borderRightValues: Computed<BorderModel, Array<string>, StoreModel>
  borderRightPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  borderColorValues: Computed<BorderModel, Array<string>, StoreModel>
  borderColorPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  borderOpacityValues: Computed<BorderModel, Array<string>, StoreModel>
  borderOpacityPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  borderStylePropertys: Computed<BorderModel, Array<Property>, StoreModel>

  ringWidthValues: Computed<BorderModel, Array<string>, StoreModel>
  ringWidthPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  ringColorValues: Computed<BorderModel, Array<string>, StoreModel>
  ringColorPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  ringOpacityValues: Computed<BorderModel, Array<string>, StoreModel>
  ringOpacityPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  ringOffsetValues: Computed<BorderModel, Array<string>, StoreModel>
  ringOffsetPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  ringOffsetColorValues: Computed<BorderModel, Array<string>, StoreModel>
  ringOffsetColorPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  divideSuffix: Computed<BorderModel, Array<string>, StoreModel>
  divideYValues: Computed<BorderModel, Array<string>, StoreModel>
  divideYPropertys: Computed<BorderModel, Array<Property>, StoreModel>
  divideXValues: Computed<BorderModel, Array<string>, StoreModel>
  divideXPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  divideColorValues: Computed<BorderModel, Array<string>, StoreModel>
  divideColorPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  divideOpacityValues: Computed<BorderModel, Array<string>, StoreModel>
  divideOpacityPropertys: Computed<BorderModel, Array<Property>, StoreModel>

  divideStylePropertys: Computed<BorderModel, Array<Property>, StoreModel>

  alreadyVariants: Computed<BorderModel, AlreadyVariants, StoreModel>
}

const borderModel: BorderModel = {
  roundedSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.borderRadius)
  }),
  roundedValues: computed([(state) => state.roundedSuffix], (roundedSuffix) => {
    return roundedSuffix.map((v) => `rounded-${v}`)
  }),
  roundedPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.roundedValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  roundedTopLeftValues: computed([(state) => state.roundedSuffix], (roundedSuffix) => {
    return roundedSuffix.map((v) => `rounded-tl-${v}`)
  }),
  roundedTopLeftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.roundedTopLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  roundedTopRightValues: computed([(state) => state.roundedSuffix], (roundedSuffix) => {
    return roundedSuffix.map((v) => `rounded-tr-${v}`)
  }),
  roundedTopRightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.roundedTopRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  roundedBottomLeftValues: computed([(state) => state.roundedSuffix], (roundedSuffix) => {
    return roundedSuffix.map((v) => `rounded-bl-${v}`)
  }),
  roundedBottomLeftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.roundedBottomLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  roundedBottomRightValues: computed([(state) => state.roundedSuffix], (roundedSuffix) => {
    return roundedSuffix.map((v) => `rounded-br-${v}`)
  }),
  roundedBottomRightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.roundedBottomRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  borderSuffix: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.borderWidth)
  }),
  borderValues: computed([(state) => state.borderSuffix], (borderSuffix) => {
    return borderSuffix.map((v) => (v === 'DEFAULT' ? 'border' : `border-${v}`))
  }),
  borderPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  borderTopValues: computed([(state) => state.borderSuffix], (borderSuffix) => {
    return borderSuffix.map((v) => (v === 'DEFAULT' ? 'border-t' : `border-t-${v}`))
  }),
  borderTopPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderTopValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  borderBottomValues: computed([(state) => state.borderSuffix], (borderSuffix) => {
    return borderSuffix.map((v) => (v === 'DEFAULT' ? 'border-b' : `border-b-${v}`))
  }),
  borderBottomPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderBottomValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  borderLeftValues: computed([(state) => state.borderSuffix], (borderSuffix) => {
    return borderSuffix.map((v) => (v === 'DEFAULT' ? 'border-l' : `border-l-${v}`))
  }),
  borderLeftPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderLeftValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),
  borderRightValues: computed([(state) => state.borderSuffix], (borderSuffix) => {
    return borderSuffix.map((v) => (v === 'DEFAULT' ? 'border-r' : `border-r-${v}`))
  }),
  borderRightPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderRightValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  borderColorValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.borderColor).map((v) => `border-${v}`)
  }),
  borderColorPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderColorValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  borderOpacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.borderOpacity).map((v) => `border-opacity-${v}`)
  }),
  borderOpacityPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.borderColorValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  borderStylePropertys: computed([(state, storeState) => storeState.controlles.propertys], (propertys) =>
    propertys.filter(({ classname }) => BorderStyleValues.includes(classname)),
  ),

  ringWidthValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.ringWidth).map((v) => (v === 'DEFAULT' ? 'ring' : `ring-${v}`))
  }),
  ringWidthPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.ringWidthValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  ringColorValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { ringColor, colors } = project.tailwindConfig.theme
    return Object.keys(Object.assign(ringColor, colors)).map((v) => `ring-offset-${v}`)
  }),
  ringColorPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.ringColorValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  ringOpacityValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.ringOpacity).map((v) => `ring-opacity-${v}`)
  }),
  ringOpacityPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.ringOpacityValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  ringOffsetValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    return Object.keys(project.tailwindConfig.theme.ringOffsetWidth).map((v) => `ring-offset-${v}`)
  }),
  ringOffsetPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.ringOffsetValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
  ),

  ringOffsetColorValues: computed([(state, storeState) => storeState.project.frontProject], (project) => {
    if (!project?.tailwindConfig) return []
    const { colors, ringOffsetColor } = project.tailwindConfig.theme
    return Object.keys(Object.assign(ringOffsetColor, colors)).map((v) => `ring-offset-${v}`)
  }),
  ringOffsetColorPropertys: computed(
    [(state, storeState) => storeState.controlles.propertys, (state) => state.ringOffsetValues],
    (propertys, values) => propertys.filter(({ classname }) => values.includes(classname)),
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

  alreadyVariants: computed(
    [
      (state: State<BorderModel>) => state.roundedPropertys,
      (state: State<BorderModel>) => state.roundedTopLeftPropertys,
      (state: State<BorderModel>) => state.roundedTopRightPropertys,
      (state: State<BorderModel>) => state.roundedBottomLeftPropertys,
      (state: State<BorderModel>) => state.roundedBottomRightPropertys,
      (state: State<BorderModel>) => state.borderTopPropertys,
      (state: State<BorderModel>) => state.borderBottomPropertys,
      (state: State<BorderModel>) => state.borderLeftPropertys,
      (state: State<BorderModel>) => state.borderRightPropertys,
      (state: State<BorderModel>) => state.borderColorPropertys,
      (state: State<BorderModel>) => state.borderOpacityPropertys,
      (state: State<BorderModel>) => state.borderStylePropertys,
      (state: State<BorderModel>) => state.ringWidthPropertys,
      (state: State<BorderModel>) => state.ringColorPropertys,
      (state: State<BorderModel>) => state.ringOpacityPropertys,
      (state: State<BorderModel>) => state.ringOffsetPropertys,
      (state: State<BorderModel>) => state.ringOffsetColorPropertys,

      (state: State<BorderModel>) => state.divideYPropertys,
      (state: State<BorderModel>) => state.divideXPropertys,
      (state: State<BorderModel>) => state.divideColorPropertys,
      (state: State<BorderModel>) => state.divideOpacityPropertys,
      (state: State<BorderModel>) => state.divideStylePropertys,
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

export default borderModel
