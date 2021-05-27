import fs from 'fs/promises'
import path from 'path'
import { types, parse, print, visit } from 'recast'
import type { NodePath } from 'ast-types/lib/node-path'
import type { namedTypes as TnamedTypes } from 'ast-types/gen/namedTypes'
import * as parser from 'recast/parsers/babel'
import type { BoolReply } from '../backend.interface'
import { findByKey, removeByKey, parseExtendProperty } from './utils'

const {
  builders,
  namedTypes: { Identifier, ObjectExpression, ObjectProperty, StringLiteral },
} = types

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

export const SetColor = async (projectPath: string, theme: string, key: string, value: string): Promise<BoolReply> => {
  const filePath = path.resolve(projectPath, 'tailwind.config.js')
  const content = await fs.readFile(filePath, 'utf8')
  const ast = parse(content, { parser })
  const { group, prefix } = parseColorsKey(key)

  let error = ''
  visit(ast, {
    visitObjectProperty(astPath: NodePath<TnamedTypes.ObjectProperty>) {
      if (!Identifier.check(astPath.node.key) || astPath.node.key.name !== 'theme') {
        this.traverse(astPath)
        return undefined
      }

      let colorsValue
      try {
        colorsValue = parseExtendProperty(astPath.node, theme)
      } catch (err) {
        error = err.message
        return false
      }

      const exist = findByKey(colorsValue.properties, group)

      if (!prefix) {
        if (exist) {
          if (!StringLiteral.check(exist.value)) {
            error = 'no-prefix: StringLiteral.check(exist.value) fail'
            return false
          }
          exist.value = builders.stringLiteral(value)
        } else {
          const cKey = builders.stringLiteral(group)
          const cValue = builders.stringLiteral(value)
          colorsValue.properties.push(builders.objectProperty(cKey, cValue))
        }
        return false
      }

      if (!exist) {
        const gKey = builders.identifier(group)
        const gValue = builders.objectExpression([])
        const groupProperty = builders.objectProperty(gKey, gValue)

        const cKey = builders.stringLiteral(prefix)
        const cValue = builders.stringLiteral(value)
        const prop = builders.objectProperty(cKey, cValue)
        ;(groupProperty.value as TnamedTypes.ObjectExpression).properties.push(prop)

        colorsValue.properties.push(groupProperty)
        return false
      }

      if (!ObjectExpression.check(exist.value)) {
        error = 'with-prefix: ObjectExpression.check(exist.value) fail'
        return false
      }

      const existPrefix = findByKey(exist.value.properties, prefix)
      if (existPrefix) {
        existPrefix.value = builders.stringLiteral(value)
      } else {
        const cKey = builders.stringLiteral(prefix)
        const cValue = builders.stringLiteral(value)
        exist.value.properties.push(builders.objectProperty(cKey, cValue))
      }

      return false
    },
  })

  if (error) {
    return { result: false, error }
  }

  const output = print(ast)
  await fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' })
  return { result: true }
}

export const RemoveColor = async (projectPath: string, theme: string, key: string): Promise<BoolReply> => {
  const filePath = path.resolve(projectPath, 'tailwind.config.js')
  const content = await fs.readFile(filePath, 'utf8')
  const ast = parse(content, { parser })
  const { group, prefix } = parseColorsKey(key)

  let error = ''
  visit(ast, {
    visitObjectProperty(astPath: NodePath<TnamedTypes.ObjectProperty>) {
      if (!Identifier.check(astPath.node.key) || astPath.node.key.name !== 'theme') {
        this.traverse(astPath)
        return undefined
      }

      let colorsValue
      try {
        colorsValue = parseExtendProperty(astPath.node, theme)
      } catch (err) {
        error = err.message
        return false
      }

      const exist = findByKey(colorsValue.properties, group)
      if (!exist) {
        RemoveColor(projectPath, 'colors', key)
        return false
      }

      if (!prefix) {
        colorsValue.properties = removeByKey(colorsValue.properties, group)
        return false
      }

      if (!ObjectExpression.check(exist.value)) {
        error = 'group: ObjectExpression.check(existGroup.value) fail'
        return false
      }

      exist.value.properties = removeByKey(exist.value.properties, prefix)
      return false
    },
  })

  if (error) {
    return { result: false, error }
  }

  const output = print(ast)
  await fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' })
  return { result: true }
}
