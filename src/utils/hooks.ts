import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import { useEffect, useRef, useCallback } from 'react'

// https://stackoverflow.com/a/62017005

function useIsMounted() {
  const isMountedRef = useRef(true)
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  return () => isMountedRef.current
}

export const useDebounce = (cb: (...args: any[]) => void, delay = 1000, deps: unknown[] = []) => {
  const options = { leading: false, trailing: true }
  const inputsRef = useRef<{ cb: (...args: any[]) => void; delay: number } | undefined>(undefined)
  const isMounted = useIsMounted()
  useEffect(() => {
    inputsRef.current = { cb, delay }
  })

  return useCallback(
    debounce(
      (...args) => {
        // Don't execute callback, if (1) component in the meanwhile
        // has been unmounted or (2) delay has changed
        if (inputsRef.current?.delay === delay && isMounted()) inputsRef.current.cb(...args)
      },
      delay,
      options,
    ),
    [delay, debounce, [...deps]],
  )
}

export const useThrottle = (cb: (...args: any[]) => void, delay = 1000, deps: unknown[] = []) => {
  const options = { leading: true, trailing: false }
  const cbRef = useRef(cb)
  useEffect(() => {
    cbRef.current = cb
  })
  return useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay, [...deps]],
  )
}
