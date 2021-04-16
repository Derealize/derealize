import { nanoid } from 'nanoid'
import type { Property } from './controlles'

export const resolution = (propertys: Array<Property>, prefix: string) => {
  const result: Array<Property> = propertys

  const tProperty = propertys.find((p) => p.classname.startsWith(`${prefix}t-`))
  const bProperty = propertys.find((p) => p.classname.startsWith(`${prefix}b-`))
  const lProperty = propertys.find((p) => p.classname.startsWith(`${prefix}l-`))
  const rProperty = propertys.find((p) => p.classname.startsWith(`${prefix}r-`))

  const yProperty = propertys.find((p) => p.classname.startsWith(`${prefix}y-`))
  const xProperty = propertys.find((p) => p.classname.startsWith(`${prefix}x-`))
  const allProperty = propertys.find((p) => p.classname.startsWith(`${prefix}-`))

  const yValue = bProperty?.classname.split('-').splice(-1)[0]
  const xValue = lProperty?.classname.split('-').splice(-1)[0]
  const allValue = rProperty?.classname.split('-').splice(-1)[0]

  if (!tProperty) {
    if (yProperty) {
      result.push({
        ...yProperty,
        id: nanoid(),
        classname: `${prefix}t-${yValue}`,
      })
    } else if (allProperty) {
      result.push({
        ...allProperty,
        id: nanoid(),
        classname: `${prefix}t-${allValue}`,
      })
    }
  }

  if (!bProperty) {
    if (yProperty) {
      result.push({
        ...yProperty,
        id: nanoid(),
        classname: `${prefix}b-${yValue}`,
      })
    } else if (allProperty) {
      result.push({
        ...allProperty,
        id: nanoid(),
        classname: `${prefix}b-${allValue}`,
      })
    }
  }

  if (!lProperty) {
    if (xProperty) {
      result.push({
        ...xProperty,
        id: nanoid(),
        classname: `${prefix}l-${xValue}`,
      })
    } else if (allProperty) {
      result.push({
        ...allProperty,
        id: nanoid(),
        classname: `${prefix}l-${allValue}`,
      })
    }
  }

  if (!rProperty) {
    if (xProperty) {
      result.push({
        ...yProperty,
        id: nanoid(),
        classname: `${prefix}r-${xValue}`,
      })
    } else if (allProperty) {
      result.push({
        ...allProperty,
        id: nanoid(),
        classname: `${prefix}r-${allValue}`,
      })
    }
  }

  return result.filter((p) => p.id !== yProperty?.id && p.id !== xProperty?.id && p.id !== allProperty?.id)
}

export const resolutionAll = (propertys: Array<Property>): Array<Property> => {
  const result = resolution(propertys, 'm')
  const result2 = resolution(result, '-m')
  const result3 = resolution(result2, 'p')
  const result4 = resolution(result3, '-p')
  const result5 = resolution(result4, 'inset')
  const result6 = resolution(result5, '-inset')
  return result6
}

const compile = (propertys: Array<Property>, prefix: string): Array<Property> => {
  let result: Array<Property> = propertys

  const tProperty = propertys.find((p) => p.classname.startsWith(`${prefix}t-`))
  const bProperty = propertys.find((p) => p.classname.startsWith(`${prefix}b-`))
  const lProperty = propertys.find((p) => p.classname.startsWith(`${prefix}l-`))
  const rProperty = propertys.find((p) => p.classname.startsWith(`${prefix}r-`))

  const tValue = tProperty?.classname.split('-').splice(-1)[0]
  const bValue = bProperty?.classname.split('-').splice(-1)[0]
  const lValue = lProperty?.classname.split('-').splice(-1)[0]
  const rValue = rProperty?.classname.split('-').splice(-1)[0]

  if (tValue && tValue === bValue && tValue === lValue && tValue === rValue) {
    result.push({
      ...tProperty,
      id: nanoid(),
      classname: `${prefix}-${tValue}`,
    })
    return result.filter(
      (p) => p.id !== tProperty?.id && p.id !== bProperty?.id && p.id !== lProperty?.id && p.id !== rProperty?.id,
    )
  }

  if (tValue && tValue === bValue) {
    result.push({
      ...tProperty,
      id: nanoid(),
      classname: `${prefix}y-${tValue}`,
    })
    result = result.filter((p) => p.id !== tProperty?.id && p.id !== bProperty?.id)
  }

  if (lValue && lValue === rValue) {
    result.push({
      ...lProperty,
      id: nanoid(),
      classname: `${prefix}x-${lValue}`,
    })
    result = result.filter((p) => p.id !== lProperty?.id && p.id !== rProperty?.id)
  }

  return result
}

export const compileAll = (propertys: Array<Property>): Array<Property> => {
  const result = compile(propertys, 'm')
  const result2 = compile(result, '-m')
  const result3 = compile(result2, 'p')
  const result4 = compile(result3, '-p')
  const result5 = compile(result4, 'inset')
  const result6 = compile(result5, '-inset')
  return result6
}
