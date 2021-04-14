import { nanoid } from 'nanoid'
import type { Property } from './controlles'

export const resolution = (property: Property): Array<Property> => {
  const propertys: Array<Property> = []
  if (property.classname.startsWith('m-')) {
    propertys.push({
      ...property,
      id: nanoid(),
      classname: property.classname.replace('m-', 'mt-'),
    })

    propertys.push({
      ...property,
      id: nanoid(),
      classname: property.classname.replace('m-', 'mb-'),
    })

    propertys.push({
      ...property,
      id: nanoid(),
      classname: property.classname.replace('m-', 'ml-'),
    })

    propertys.push({
      ...property,
      id: nanoid(),
      classname: property.classname.replace('m-', 'mr-'),
    })
  }
  return propertys
}

export const compile = (propertys: Array<Property>): void => {
  const mtProperty = propertys.find((p) => p.classname.startsWith('mt-'))
  const mbProperty = propertys.find((p) => p.classname.startsWith('mb-'))
  const mlProperty = propertys.find((p) => p.classname.startsWith('ml-'))
  const mrProperty = propertys.find((p) => p.classname.startsWith('mr-'))

  const mtValue = mtProperty?.classname.split('-').splice(-1)[0]
  const mbValue = mbProperty?.classname.split('-').splice(-1)[0]
  const mlValue = mlProperty?.classname.split('-').splice(-1)[0]
  const mrValue = mrProperty?.classname.split('-').splice(-1)[0]

  if (mtValue && mtValue === mbValue) {
    if (mlValue === mrValue) {
      propertys.push({
        ...mtProperty,
        id: nanoid(),
        classname: `m-${mtValue}`,
      })
    }
  }
}
