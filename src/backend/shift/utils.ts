import { types, parse, print, visit } from 'recast'
import type { namedTypes as TnamedTypes } from 'ast-types/gen/namedTypes'

const {
  builders,
  namedTypes: { Identifier, ObjectExpression, ObjectProperty, StringLiteral },
} = types

type Property =
  | TnamedTypes.Property
  | TnamedTypes.ObjectMethod
  | TnamedTypes.ObjectProperty
  | TnamedTypes.SpreadProperty
  | TnamedTypes.SpreadElement

export const findByKey = (properties: Property[], key: string): TnamedTypes.ObjectProperty | undefined => {
  return properties.find((p) => {
    if (!ObjectProperty.check(p)) return false
    if (Identifier.check(p.key) && p.key.name === key) return true
    if (StringLiteral.check(p.key) && p.key.value === key) return true
    return false
  }) as TnamedTypes.ObjectProperty | undefined
}

export const removeByKey = (properties: Property[], key: string): Property[] => {
  return properties.filter((p) => {
    if (ObjectProperty.check(p)) {
      if (Identifier.check(p.key)) {
        return p.key.name !== key
      }
      if (StringLiteral.check(p.key)) {
        return p.key.value !== key
      }
    }
    return true
  })
}

const parseExtendProperty = (theme: TnamedTypes.ObjectProperty): TnamedTypes.ObjectExpression => {
  if (!ObjectExpression.check(theme.value)) {
    throw new Error('ObjectExpression.check(theme.value) fail')
  }

  const extend = theme.value.properties.find(
    (p) => ObjectProperty.check(p) && Identifier.check(p.key) && p.key.name === 'extend',
  ) as TnamedTypes.ObjectProperty | undefined

  if (!extend || !ObjectExpression.check(extend.value)) {
    throw new Error('extend && ObjectExpression.check(extend.value) fail')
  }

  return extend.value
}

export const parseColorsProperty = (theme: TnamedTypes.ObjectProperty): TnamedTypes.ObjectExpression => {
  const extendValue = parseExtendProperty(theme)

  let colors = extendValue.properties.find(
    (p) => ObjectProperty.check(p) && Identifier.check(p.key) && p.key.name === 'colors',
  ) as TnamedTypes.ObjectProperty | undefined

  if (!colors) {
    const bKey = builders.identifier('colors')
    const bValue = builders.objectExpression([])
    colors = builders.objectProperty(bKey, bValue)
    extendValue.properties.push(colors)
  }

  if (!ObjectExpression.check(colors.value)) {
    throw new Error('ObjectExpression.check(colors.value) fail')
  }

  return colors.value
}

export const parseBackgroundImageProperty = (theme: TnamedTypes.ObjectProperty): TnamedTypes.ObjectExpression => {
  const extendValue = parseExtendProperty(theme)

  let backgroundImage = extendValue.properties.find(
    (p) => ObjectProperty.check(p) && Identifier.check(p.key) && p.key.name === 'backgroundImage',
  ) as TnamedTypes.ObjectProperty | undefined

  if (!backgroundImage) {
    const bKey = builders.identifier('backgroundImage')
    const bValue = builders.objectExpression([])
    backgroundImage = builders.objectProperty(bKey, bValue)
    extendValue.properties.push(backgroundImage)
  }

  if (!ObjectExpression.check(backgroundImage.value)) {
    throw new Error('ObjectExpression.check(backgroundImage.value) fail')
  }

  return backgroundImage.value
}

export const parseColorsKey = (key: string): { group: string; prefix: string } => {
  const keys = key.split('/')
  let group = keys.slice(-1)[0]
  let prefix = ''
  if (keys.length > 1) {
    prefix = group
    keys.splice(-1)
    group = keys.join('/')
  }

  return { group, prefix }
}
