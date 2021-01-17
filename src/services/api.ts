import ky from 'ky'
import { errorHander, ToastCaller } from '../utils/toast'

const api = ky.extend({
  timeout: 8000,
  // prefixUrl: process.env.REACT_APP_HOST,
})

interface LoggedData {
  jwt: string
  user: {
    id: number
    username: string
  }
}

// eslint-disable-next-line import/prefer-default-export
export const login = async (identifier: string, password: string, toaster?: ToastCaller): Promise<void> => {
  try {
    const resp = await api
      .post('auth/local', {
        json: { identifier, password },
      })
      .json<LoggedData>()

    localStorage.setItem('jwt', resp.jwt)
    localStorage.setItem('profile', JSON.stringify(resp.user))
  } catch (err) {
    errorHander(err, toaster)
  }
}
