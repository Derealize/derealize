import fs from 'fs'
import path from 'path'
import clone from 'lodash.clonedeep'
import { types, parse, print, visit } from 'recast'
import type { NodePath } from 'ast-types/lib/node-path'
import type { namedTypes as TnamedTypes } from 'ast-types/gen/namedTypes'
import * as parser from 'recast/parsers/babel'
import { ElementPayload, InsertMode, InsertElementPayload, ElementTagType, ReplaceElementPayload } from '../interface'
import log from './log'

const { builders, namedTypes } = types

export const Apply = async (projectPath: string, payloads: Array<ElementPayload>) => {
  const firstCodePosition = payloads[0].codePosition
  const firstPosition = firstCodePosition.split(':')
  const filePath = path.resolve(projectPath, firstPosition[0])
  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })

  payloads.forEach(({ codePosition, className, dropzoneCodePosition }) => {
    const position = codePosition.split(':')
    const targetLine = parseInt(position[1], 10)
    const targetColumn = parseInt(position[2], 10)

    visit(ast, {
      visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
        const { node } = astPath

        if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
          const onode = node.openingElement
          if (!onode.attributes) {
            onode.attributes = []
          }

          const attr = onode.attributes.find((n) => namedTypes.JSXAttribute.check(n) && n.name.name === 'className')

          if (!attr) {
            if (className) {
              onode.attributes.push(
                builders.jsxAttribute(builders.jsxIdentifier('className'), builders.stringLiteral(className)),
              )
            }
          } else if (!className) {
            onode.attributes = onode.attributes.filter(
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

        this.traverse(astPath)
        return undefined
      },
    })

    if (dropzoneCodePosition) {
      const zonePosition = dropzoneCodePosition.split(':')
      const zoneTargetLine = parseInt(zonePosition[1], 10)
      const zoneTargetColumn = parseInt(zonePosition[2], 10)

      let sourceNode: TnamedTypes.JSXElement
      visit(ast, {
        visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
          const { node } = astPath
          if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
            sourceNode = clone(node)
            astPath.prune()
            return false
          }

          this.traverse(astPath)
          return undefined
        },
      })

      visit(ast, {
        visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
          const { node } = astPath
          if (node.loc?.start.line === zoneTargetLine && node.loc.start.column === zoneTargetColumn) {
            if (!node.children) {
              node.children = []
            }
            node.children.push(sourceNode)
            return false
          }

          this.traverse(astPath)
          return undefined
        },
      })
    }
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}

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

export const Insert = (projectPath: string, { codePosition, insertTagType, insertMode }: InsertElementPayload) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        const jsxId = builders.jsxIdentifier(insertTagType)
        const close = builders.jsxClosingElement(jsxId)

        const open = builders.jsxOpeningElement(jsxId)
        let className = 'bg-green-100'
        switch (insertTagType) {
          case ElementTagType.div:
            className = 'bg-green-100 my-2 py-2'
            break
          case ElementTagType.span:
          case ElementTagType.a:
            className = 'bg-green-100 mx-2 px-2'
            break
          case ElementTagType.button:
            className = 'bg-green-100 m-2 p-2'
            break
          default:
            break
        }
        open.attributes = []
        open.attributes.push(
          builders.jsxAttribute(builders.jsxIdentifier('className'), builders.stringLiteral(className)),
        )

        const element = builders.jsxElement(open, close)

        if (insertMode === InsertMode.After) {
          astPath.insertAfter(element)
        } else if (insertMode === InsertMode.Before) {
          astPath.insertBefore(element)
        } else if (insertMode === InsertMode.Append) {
          if (!node.children) {
            node.children = []
          }
          node.children.push(element)
        }
        //  else if (insertMode === InsertMode.Prepend) {
        //   if (!node.children) {
        //     node.children = []
        //   }
        //   node.children.unshift(element)
        // }

        return false
      }

      this.traverse(astPath)
      return undefined
    },
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}

export const Delete = (projectPath: string, { codePosition }: ElementPayload) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        astPath.prune()
        return false
      }

      this.traverse(astPath)
      return undefined
    },
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}

export const Replace = (projectPath: string, { codePosition, replaceTagType }: ReplaceElementPayload) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        const jsxId = builders.jsxIdentifier(replaceTagType)
        node.name = jsxId
        node.openingElement.name = jsxId
        if (node.closingElement) {
          node.closingElement.name = jsxId
        }
        return false
      }

      this.traverse(astPath)
      return undefined
    },
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}

export const Text = (projectPath: string, { codePosition, text }: ElementPayload) => {
  const { ast, targetLine, targetColumn, filePath } = parseCodePosition(projectPath, codePosition)

  visit(ast, {
    visitJSXElement(astPath: NodePath<TnamedTypes.JSXElement>) {
      const { node } = astPath

      if (node.loc?.start.line === targetLine && node.loc.start.column === targetColumn) {
        if (!text) {
          node.children = []
        } else {
          if (node.openingElement.selfClosing) {
            node.closingElement = builders.jsxClosingElement(node.openingElement.name)
            node.openingElement.selfClosing = false
          }
          const jsxText = builders.jsxText(text)
          node.children = [jsxText]
        }
        return false
      }

      this.traverse(astPath)
      return undefined
    },
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}

export const ThemeBackgroundImage = (themeFilePath: string, key: string, value: string) => {
  const filePath = path.resolve(themeFilePath)
  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })

  visit(ast, {
    visitObjectProperty(astPath: NodePath<TnamedTypes.ObjectProperty>) {
      const { node } = astPath

      if (namedTypes.Identifier.check(node.key) && node.key.name === 'theme') {
        if (namedTypes.ObjectExpression.check(node.value)) {
          const extend = node.value.properties.find(
            (p) => namedTypes.ObjectProperty.check(p) && namedTypes.Identifier.check(p.key) && p.key.name === 'extend',
          )

          if (namedTypes.ObjectProperty.check(extend) && namedTypes.ObjectExpression.check(extend.value)) {
            let backgroundImage = extend.value.properties.find(
              (p) =>
                namedTypes.ObjectProperty.check(p) &&
                namedTypes.Identifier.check(p.key) &&
                p.key.name === 'backgroundImage',
            )

            if (!backgroundImage) {
              const bKey = builders.identifier('backgroundImage')
              const bValue = builders.objectExpression([])
              const property = builders.objectProperty(bKey, bValue)
              backgroundImage = property
              extend.value.properties.push(property)
            }

            if (
              namedTypes.ObjectProperty.check(backgroundImage) &&
              namedTypes.ObjectExpression.check(backgroundImage.value)
            ) {
              const bKey = builders.stringLiteral(key)
              const bValue = builders.stringLiteral(value)
              const property = builders.objectProperty(bKey, bValue)
              backgroundImage.value.properties.push(property)
            } else {
              log('Property.check(backgroundImage) && ObjectExpression.check(backgroundImage.value) fail')
            }
          } else {
            log('Property.check(extend) && ObjectExpression.check(extend.value) fail')
          }
        } else {
          log('ObjectExpression.check(node.value) fail')
        }

        return false
      }

      this.traverse(astPath)
      return undefined
    },
  })

  const output = print(ast)
  fs.writeFile(filePath, output.code.replace(/\r\n/g, '\n'), { encoding: 'utf8' }, () => null)
}
