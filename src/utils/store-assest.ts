import type { State } from 'easy-peasy'
import type { StoreModel } from '../models/index'
import type { PreloadWindow } from '../preload'
import type { Property } from '../models/controlles/controlles'

declare const window: PreloadWindow
const { withRuntime } = window.env

export const storeStateProject = (state: any, storeState: State<StoreModel>) => {
  return withRuntime ? storeState.projectWithRuntime.frontProject : storeState.project.frontProject
}

export const propertyTransClassName = (property: Property): string => {
  const { screen, state, list, custom, dark, classname } = property
  if (!classname) return ''

  let variants = ''
  if (screen) {
    variants += `${screen}:`
  }
  if (state) {
    variants += `${state}:`
  }
  if (list) {
    variants += `${list}:`
  }
  if (custom) {
    variants += `${custom}:`
  }
  if (dark) {
    variants += `dark:`
  }
  return `${variants + classname}`
}

export const propertysTransClassName = (propertys: Array<Property>) => {
  return propertys
    .map(propertyTransClassName)
    .filter((name) => !!name)
    .join(' ')
}
