import fs from 'fs'
import path from 'path'
import { types, parse, print } from 'recast'
import * as parser from 'recast/parsers/babel'
import log from './log'

const { builders, namedTypes } = types

const JsxSubKeys = ['expression', 'body', 'argument', 'init', 'openingElement']

export default async (projectPath: string, codePosition: string, className: string) => {
  log(`shift: ${projectPath} ${codePosition} ${className}`)
  const position = codePosition.split(':')
  const filePath = path.resolve(projectPath, position[0])
  log(`filePath: ${filePath}`)
  const targetLine = parseInt(position[1], 10)
  const targetColumn = parseInt(position[2], 10)

  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })

  const reduceAstNode = (node: any) => {
    if (namedTypes.JSXOpeningElement.check(node) && node.loc && node.attributes) {
      const { line, column } = node.loc.start
      if (line === targetLine && column === targetColumn) {
        log(`bingo! ${node.type}`)
        const attr = node.attributes.find((a) => namedTypes.JSXAttribute.check(a) && a.name.name === 'className')

        if (!attr) {
          if (className) {
            node.attributes.push(
              builders.jsxAttribute(builders.jsxIdentifier('className'), builders.stringLiteral(className)),
            )
          }
        } else if (!className) {
          node.attributes = node.attributes.filter(
            (a) => !(namedTypes.JSXAttribute.check(a) && a.name.name !== 'className'),
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

        const output = print(ast)
        fs.writeFileSync(filePath, output.code, { encoding: 'utf8' })
        return
      }
    }

    Object.keys(node).forEach((key) => {
      if (Array.isArray(node[key])) {
        node[key].forEach((n: any) => reduceAstNode(n))
      } else if (JsxSubKeys.includes(key)) {
        reduceAstNode(node[key])
      }
    })
  }

  reduceAstNode(ast.program)
}
