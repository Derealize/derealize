import { createStore, persist, PersistConfig, createTypedHooks } from 'easy-peasy'
import model, { StoreModel } from './models'
import * as apiService from './services/api'
import { PreloadWindow } from './preload'

declare const window: PreloadWindow

export const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>()

export interface Injections {
  apiService: typeof apiService
}

const persistConfig: PersistConfig<typeof model> = {
  // blacklist: ['trending'],
}

const store = createStore(persist(model, persistConfig), {
  injections: { apiService } as Injections,
})

const debugStore = createStore(model, {
  // 👇 provide injections to our store
  injections: { apiService } as Injections,
})

export default window.env.isDev ? debugStore : store
