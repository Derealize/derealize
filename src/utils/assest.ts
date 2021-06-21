import type { Property } from '../models/controlles/controlles'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const StringEnumObjects = (enumme: any): Array<{ label: string; value: string }> => {
  return Object.keys(enumme).map((key) => ({ label: key, value: enumme[key] }))
}

export const IntEnumObjects = (enumme: any): Array<{ label: string; value: number }> => {
  return Object.keys(enumme)
    .filter((value) => !Number.isNaN(Number(value)))
    .map((key) => ({ label: enumme[key], value: parseInt(key, 10) }))
}

export const IntEnumValues = (enumme: any): Array<string> => {
  return Object.keys(enumme).filter((value) => !Number.isNaN(Number(value)))
}

export const CssUrlReg = /(?:url\(['"]?)(.*?)(?:['"]?\))/

export const BlockDisplays = ['flex', 'block', 'table', 'grid', 'list-item'] // use include()
export const InlineDisplays = ['inline', 'none', 'contents']

export const propertysTransClassName = (propertys: Array<Property>) => {
  let result = ''
  propertys.forEach((property) => {
    const { screen, state, list, custom, dark, classname } = property
    if (!classname) return

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
    result += `${variants + classname} `
  })
  return result
}

// https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element
export const ReplacedElementTagName = [
  'IMG',
  'IFRAME',
  'VIDEO',
  'EMBED',
  'OPTION',
  'AUDIO',
  'CANVAS',
  'OBJECT',
  'APPLET',
]

// https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
export const EmptyElement = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

export const DropzoneTags = [
  'div',
  'p',
  'main',
  'section',
  'nav',
  'footer',
  'form',
  'header',
  'article',
  'aside',
  'body',
  'col',
  'fieldset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'figcaption',
]
