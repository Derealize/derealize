import { UseToastOptions } from '@chakra-ui/react'
import ky, { HTTPError } from 'ky'

export type ToastCaller = (props: UseToastOptions) => void
export type ToastStatus = 'error' | 'success' | 'warning' | 'info'

export const errorHander = (data: string | Error, caller?: ToastCaller, _status: ToastStatus = 'warning'): void => {
  let title = data as string
  let status = _status

  if (data instanceof Error) {
    title = data.message
    if ((data as HTTPError).response?.status === 401) {
      // title = "auth fail"
      window.location.href = '/login'
      return
    }
    status = 'error'
    console.error(data)
  }

  if (caller) {
    caller({
      title,
      status,
      isClosable: true,
      position: 'top',
    })
  } else {
    alert(data)
  }
}

export const botErrorHander = (data: string | Error, caller?: ToastCaller, _status: ToastStatus = 'warning'): void => {
  let title = data as string
  let status = _status

  if (data instanceof Error) {
    title = data.message
    if ((data as HTTPError).response?.status === 401) {
      // title = "auth fail"
      window.location.href = '/loginbot'
      return
    }
    status = 'error'
    console.error(data)
  }

  if (caller) {
    caller({
      title,
      status,
      isClosable: true,
      position: 'top',
    })
  } else {
    alert(data)
  }
}
