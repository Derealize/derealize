import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import Language, { navigatorLanguage } from '../utils/language'
import PreloadWindow from '../preload_inteeface'

declare const window: PreloadWindow

export enum UserRole {
  Ultimate = 3,
  Premium = 2,
  Free = 1,
  Unverified = 0,
}

export interface Profile {
  id: string
  username: string
  email?: string
  role: UserRole
  settings?: Settings
  avatar?: string
}

export interface Settings {
  language: Language
  notification: boolean
}

export interface ProfileModel {
  settings: Settings | null
  setSettings: Action<ProfileModel, { settings: Settings | null; storage?: boolean; post?: boolean }>

  jwt: string | null
  setJwt: Action<ProfileModel, { jwt: string | null; storage?: boolean }>

  profile: Profile | null
  setProfile: Action<ProfileModel, { profile: Profile | null }>

  load: Thunk<ProfileModel>
  logout: Thunk<ProfileModel>
}

const profileModel: ProfileModel = {
  settings: {
    language: navigatorLanguage(navigator.language),
    notification: true,
  },
  setSettings: action((state, { settings, storage = false, post = false }) => {
    state.settings = settings
    if (storage) {
      window.electron.setStore({ settings })
    }
    if (post && state.jwt) {
      ky.post(`${process.env.REACT_APP_NEST}/users/settings`, {
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        json: state.settings,
      })
    }
  }),

  jwt: null,
  setJwt: action((state, { jwt, storage = false }) => {
    state.jwt = jwt
    localStorage.setItem('jwt', jwt || '') // support PrivateRoute
    if (storage) {
      window.electron.setStore({ jwt })
    }
  }),

  profile: null,
  setProfile: action((state, { profile }) => {
    state.profile = profile
  }),

  load: thunk(async (actions, payload, { getState }) => {
    const settings = (await window.electron.getStore('settings')) as Settings
    if (settings) {
      actions.setSettings({ settings })
    }

    const jwt = (await window.electron.getStore('jwt')) as string
    if (!jwt) {
      actions.logout()
      return
    }

    actions.setJwt({ jwt, storage: false })

    try {
      const profile = await ky
        .get(`${process.env.REACT_APP_NEST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()

      actions.setProfile({ profile })

      if (profile.settings) {
        actions.setSettings({ settings: profile.settings, storage: true })
      } else if (settings) {
        actions.setSettings({ settings, post: true })
      }
    } catch (err) {
      console.error(err.message)
      actions.logout()
    }
  }),

  logout: thunk(async (actions) => {
    actions.setProfile({ profile: null })
    actions.setJwt({ jwt: null })
  }),
}

export default profileModel
