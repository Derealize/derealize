import { FileInfo, API, Options, JSXAttribute } from 'jscodeshift'
import log from './log'

const transformer = (file: FileInfo, api: API, options: Options) => {
  const { jscodeshift: shift } = api
  const { line, column, className } = options

  const source = shift(file.source)

  source.find(shift.JSXOpeningElement).forEach((path) => {
    const { loc, attributes } = path.value
    if (!loc || !attributes) return

    if (loc.start.line === line && loc.start.column === column) {
      const attr = attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'className')

      if (!attr) {
        if (className) {
          attributes.push(shift.jsxAttribute(shift.jsxIdentifier('className'), shift.stringLiteral(className)))
        }
        return
      }

      if (className) {
        const jsxAttr = attr as JSXAttribute
        if (jsxAttr.value?.type === 'Literal') {
          jsxAttr.value.value = className
        } else if (jsxAttr.value?.type === 'JSXExpressionContainer') {
          // todo: 使用babel实现依赖状态表达式的 className
          log(`${file.path} Cannot predictibly change JSX expression, skipping`)
        } else if (jsxAttr.value) {
          log(`${file.path} Attempting to change non-string value: ${jsxAttr.value?.type}, this might not work`)
          ;(jsxAttr.value as any).value = className
        } else {
          jsxAttr.value = shift.stringLiteral(className)
        }
      } else {
        path.value.attributes = attributes.filter((a) => a.type === 'JSXAttribute' && a.name.name !== 'className')
      }
    }
  })

  return source.toSource()
}

export default transformer
