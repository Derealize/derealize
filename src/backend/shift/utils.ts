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

export const parseExtendProperty = (theme: TnamedTypes.ObjectProperty, name: string): TnamedTypes.ObjectExpression => {
  if (!ObjectExpression.check(theme.value)) {
    throw new Error('ObjectExpression.check(theme.value) fail')
  }

  const extend = theme.value.properties.find(
    (p) => ObjectProperty.check(p) && Identifier.check(p.key) && p.key.name === 'extend',
  ) as TnamedTypes.ObjectProperty | undefined

  if (!extend || !ObjectExpression.check(extend.value)) {
    throw new Error('extend && ObjectExpression.check(extend.value) fail')
  }

  let property = extend.value.properties.find(
    (p) => ObjectProperty.check(p) && Identifier.check(p.key) && p.key.name === name,
  ) as TnamedTypes.ObjectProperty | undefined

  if (!property) {
    const bKey = builders.identifier(name)
    const bValue = builders.objectExpression([])
    property = builders.objectProperty(bKey, bValue)
    extend.value.properties.push(property)
  }

  if (!ObjectExpression.check(property.value)) {
    throw new Error(`ObjectExpression.check(${name}.value) fail`)
  }

  return property.value
}
