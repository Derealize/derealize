import PreloadWindow from '../preload_inteeface'

declare const window: PreloadWindow

export const crossCtrl = window.env.isMac ? '⌘' : 'CTRL'

// eslint-disable-next-line import/prefer-default-export
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const StringEnumObjects = (enumme: any, prefix?: string): Array<{ label: string; value: string }> => {
  return Object.keys(enumme).map((key, i) => ({ label: i === 0 && prefix ? prefix + key : key, value: enumme[key] }))
}

export const IntEnumObjects = (enumme: any, prefix?: string): Array<{ label: string; value: number }> => {
  return Object.keys(enumme)
    .filter((value) => !Number.isNaN(Number(value)))
    .map((key, i) => ({ label: i === 0 && prefix ? prefix + enumme[key] : enumme[key], value: parseInt(key, 10) }))
}
