import fs from 'fs'
import path from 'path'
import { types, parse, print } from 'recast'
import * as parser from 'recast/parsers/babel'
import log from './log'

const { builders, namedTypes } = types

const JsxSubKeys = ['expression', 'body', 'argument', 'init', 'declaration']

export default async (projectPath: string, codePosition: string, className: string) => {
  const position = codePosition.split(':')
  const filePath = path.resolve(projectPath, position[0])
  log(`filePath: ${filePath} className: ${className}`)
  const targetLine = parseInt(position[1], 10)
  const targetColumn = parseInt(position[2], 10)
  // log(`targetLine: ${targetLine} targetColumn: ${targetColumn}`)

  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content, {
    parser,
  })

  const reduceAstNode = (cnode: any): boolean => {
    // log(`reduceAstNode! ${cnode.type}`)
    if (namedTypes.JSXElement.check(cnode) && cnode.loc) {
      const { line, column } = cnode.loc.start
      const node = cnode.openingElement
      if (line === targetLine && column === targetColumn && node.attributes) {
        // log(`bingo! ${node.type} ${node.loc?.start.line}`)
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

        const output = print(ast)
        fs.writeFileSync(filePath, output.code, { encoding: 'utf8' })
        return false
      }
    }

    Object.keys(cnode).every((key): boolean => {
      if (Array.isArray(cnode[key])) {
        return cnode[key].every((n: any) => reduceAstNode(n))
      }
      if (JsxSubKeys.includes(key)) {
        return reduceAstNode(cnode[key])
      }
      return true
    })

    return true
  }

  reduceAstNode(ast.program)
}
