import type { TailwindColorGroup } from 'tailwindcss/tailwind-config'
import type { GroupType } from '../components/SelectController'
import type { Property } from '../models/controlles/controlles'

export const buildColorOptions = (
  colors: { [key: string]: string | TailwindColorGroup },
  prefix: string,
): Array<GroupType> => {
  return Object.entries(colors).map(([label, value]) => ({
    label,
    options:
      typeof value === 'string'
        ? [{ value: `${prefix}-${label}`, label: value }]
        : Object.entries(value as TailwindColorGroup).map(([l, v]) => ({ value: `${prefix}-${label}-${l}`, label: v })),
  }))
}

export const filterColorPropertys = (propertys: Array<Property>, values: Array<GroupType>) => {
  if (!values.length) return []
  const valuesString = values
    .map((v) => v.options)
    .reduce((pre, cur) => pre.concat(cur))
    .map((o) => o.value)
  return propertys.filter(({ classname }) => valuesString.includes(classname))
}
