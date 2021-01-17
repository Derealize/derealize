import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import Language, { navigatorLanguage } from '../utils/language'
import PreloadWindow from '../preload_window'

declare let window: PreloadWindow

export enum UserRole {
  Admin = 'admin',
  Collaborator = 'collaborator',
  User = 'user',
}

export interface Profile {
  id: number
  username: string
  email?: string
  displayName?: string
  githubToken?: string
  googleToken?: string
  avatar?: string
  role: UserRole
  invitationCode: string
  invitationCount: number
  settings?: Settings // In order to transfer data, not to be state
}

export interface Settings {
  language?: Language
  useOriginUrl?: boolean
  openNewPage?: boolean
  displayTrending?: boolean
}

export interface ProfileModel {
  jwt: string | null
  setJwt: Action<ProfileModel, { jwt: string | null; storage?: boolean }>

  settings: Settings
  setSettings: Action<ProfileModel, { settings: Settings; storage?: boolean; post?: boolean }>

  profile: Profile | null
  setProfile: Action<ProfileModel, { profile: Profile | null; storage?: boolean }>

  load: Thunk<ProfileModel>
  logout: Thunk<ProfileModel>
}

const profileModel: ProfileModel = {
  jwt: null,
  setJwt: action((state, { jwt, storage = true }) => {
    state.jwt = jwt
    if (storage) {
      window.setStore({ jwt })
    }
  }),

  settings: {
    language: navigatorLanguage(navigator.language),
    useOriginUrl: false,
    openNewPage: true,
    displayTrending: true,
  },
  setSettings: action((state, { settings, storage = true, post = true }) => {
    state.settings = { ...state.settings, ...settings }

    if (storage) {
      window.setStore({ settings: state.settings })
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

  profile: null,
  setProfile: action((state, { profile, storage = true }) => {
    state.profile = profile
    if (storage) {
      window.setStore({ profile })
    }
  }),

  load: thunk(async (actions, payload, { getState }) => {
    const localSettings = window.getStore('settings') as Settings
    if (localSettings) {
      actions.setSettings({
        settings: localSettings,
        storage: false,
        post: false,
      })
    }

    const localJwt = window.getStore('jwt') as string
    if (localJwt) {
      actions.setJwt({ jwt: localJwt, storage: false })
    }

    const localProfiles = await window.getStore('profile') as Profile
    if (localProfiles) {
      actions.setProfile({ profile: localProfiles, storage: false })
    }

    try {
      const { jwt } = getState()
      if (!jwt) {
        actions.logout()
        return
      }

      const data = await ky
        .get(`${process.env.REACT_APP_NEST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()

      const { settings, ...profile } = data
      actions.setProfile({ profile })

      if (settings) {
        actions.setSettings({ settings, post: false })
      } else if (localSettings) {
        // post to nest
        actions.setSettings({ settings: localSettings, storage: false })
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
