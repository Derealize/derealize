import fs from 'fs'
import path from 'path'
import { types, parse, print, visit } from 'recast'
import type { NodePath } from 'ast-types/lib/node-path'
import type { namedTypes as TnamedTypes } from 'ast-types/gen/namedTypes'
import * as parser from 'recast/parsers/babel'
import { ElementPayload, InsertMode, InsertElementPayload } from '../interface'
import log from './log'

const { builders, namedTypes } = types

const parseCodePosition = (
  projectPath: string,
  codePosition: string,
): { ast: any; targetLine: number; targetColumn: number; filePath: string } => {
  const position = codePosition.split(':')
  const filePath = path.resolve(projectPath, position[0])
  const targetLine = parseInt(position[1], 10)
  const targetColumn = parseInt(position[2], 10)

  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })

  return { ast, targetLine, targetColumn, filePath }
}

export const ApplyClass = (projectPath: string, { codePosition, className }: ElementPayload) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        if (!node.attributes) {
          node.attributes = []
        }

        const attr = node.attributes.find((a) => namedTypes.JSXAttribute.check(a) && a.name.name === 'className')

        if (!attr) {
          if (className) {
            node.attributes.push(
              builders.jsxAttribute(builders.jsxIdentifier('className'), builders.stringLiteral(className)),
            )
          }
        } else if (!className) {
          node.attributes = node.attributes.filter(
            (a) => !(namedTypes.JSXAttribute.check(a) && a.name.name === 'className'),
          )
        } else if (namedTypes.JSXAttribute.check(attr)) {
          if (namedTypes.StringLiteral.check(attr.value)) {
            attr.value.value = className
          } else if (namedTypes.JSXExpressionContainer.check(attr.value)) {
            // todo: 使用babel实现依赖状态表达式的 className
            log(`${filePath} Cannot predictibly change JSX expression, skipping`)
          } else if (!attr.value) {
            attr.value = builders.stringLiteral(className)
          }
        }

        return false
      }

      this.traverse(path)
      return true
    },
  })

  const output = print(ast)
  fs.writeFileSync(filePath, output.code, { encoding: 'utf8' })
}

export const InsertElement = (
  projectPath: string,
  { codePosition, insertTagName, insertMode }: InsertElementPayload,
) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        const jsxId = builders.jsxIdentifier(insertTagName)
        const open = builders.jsxOpeningElement(jsxId)
        const close = builders.jsxClosingElement(jsxId)
        const element = builders.jsxElement(open, close)

        if (insertMode === InsertMode.after) {
          astPath.insertBefore(element)
        } else if (insertMode === InsertMode.before) {
          astPath.insertBefore(element)
        } else if (insertMode === InsertMode.append) {
          if (!node.children) {
            node.children = []
          }
          node.children.push(element)
        } else if (insertMode === InsertMode.prepend) {
          if (!node.children) {
            node.children = []
          }
          node.children.unshift(element)
        }

        return false
      }

      this.traverse(path)
      return true
    },
  })

  const output = print(ast)
  fs.writeFileSync(filePath, output.code, { encoding: 'utf8' })
}
