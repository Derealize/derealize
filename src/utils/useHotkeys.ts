import hotkeys, { HotkeysEvent } from 'hotkeys-js'
import { useCallback, useEffect } from 'react'
import uniq from 'lodash/uniq'
import pullall from 'lodash/pullAll'

type CallbackFn = (event: KeyboardEvent, handler: HotkeysEvent) => void

// https://github.com/JohannesKlauss/react-hotkeys-hook/pull/146
// https://github.com/jaywcjlove/hotkeys#filter
// todo: 无法按照useHotkeys分区filter
let targetClassNames: string[] = []
hotkeys.filter = (e: KeyboardEvent) => {
  const { target } = e as KeyboardEvent & { target: HTMLElement }
  if (targetClassNames.length) {
    return targetClassNames.some((c) => target.className.split(' ').includes(c) || target.tagName === c)
  }
  return !(target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
}

export default function useHotkeys(
  keys: string,
  callback: CallbackFn,
  deps: any[] = [],
  classNames: string[] = [],
): void {
  const memoisedCallback = useCallback(callback, deps)

  useEffect(() => {
    if (!keys) return () => null
    targetClassNames = uniq(targetClassNames.concat(classNames))
    hotkeys(keys, memoisedCallback)
    return () => {
      hotkeys.unbind(keys, memoisedCallback)
      pullall(targetClassNames, classNames)
    }
  }, [keys, memoisedCallback, classNames])
}
