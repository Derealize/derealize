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

const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
const iosPlatforms = ['iPhone', 'iPad', 'iPod']

export const getCrossCtrl = (): string => {
  if (macosPlatforms.indexOf(window.navigator.platform) !== -1) {
    return '⌘'
  }
  return 'Ctrl'
}

export const BlockDisplays = ['flex', 'block', 'table', 'grid', 'list-item'] // use include()
export const InlineDisplays = ['inline', 'none', 'contents']

// https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element
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
