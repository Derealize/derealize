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

export const SetImage = async (projectPath: string, key: string, value: string): Promise<BoolReply> => {
  const filePath = path.resolve(projectPath, 'tailwind.config.js')
  const content = await fs.readFile(filePath, 'utf8')
  const ast = parse(content, { parser })
  let error = ''

  visit(ast, {
    visitObjectProperty(astPath: NodePath<TnamedTypes.ObjectProperty>) {
      if (!Identifier.check(astPath.node.key) || astPath.node.key.name !== 'theme') {
        this.traverse(astPath)
        return undefined
      }

      let backgroundImageValue
      try {
        backgroundImageValue = parseExtendProperty(astPath.node, 'backgroundImages')
      } catch (err) {
        error = err.message
        return false
      }

      const exist = findByKey(backgroundImageValue.properties, key)

      if (exist) {
        exist.value = builders.stringLiteral(value)
      } else {
        const bKey = builders.stringLiteral(key)
        const bValue = builders.stringLiteral(value)
        backgroundImageValue.properties.push(builders.objectProperty(bKey, bValue))
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

export const RemoveImage = async (projectPath: string, key: string): Promise<BoolReply> => {
  const filePath = path.resolve(projectPath, 'tailwind.config.js')
  const content = await fs.readFile(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })
  let error = ''

  visit(ast, {
    visitObjectProperty(astPath: NodePath<TnamedTypes.ObjectProperty>) {
      if (!Identifier.check(astPath.node.key) || astPath.node.key.name !== 'theme') {
        this.traverse(astPath)
        return undefined
      }

      let backgroundImageValue
      try {
        backgroundImageValue = parseExtendProperty(astPath.node, 'backgroundImage')
      } catch (err) {
        error = err.message
        return false
      }

      backgroundImageValue.properties = removeByKey(backgroundImageValue.properties, key)
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
