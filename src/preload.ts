import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'
import * as Sentry from '@sentry/electron/dist/renderer'
import { Handler, Broadcast } from './backend/backend.interface'
import { connectSocket, sendBackIpc, listenBackIpc, unlistenBackIpc } from './client-ipc'
import { version } from './package.json'

console.log('process.env.SENTRYDNS', process.env.SENTRYDNS)
// https://docs.sentry.io/platforms/javascript/guides/electron/#browser-integration
// Cannot catch the exception of react component, also need react sdk
Sentry.init({ dsn: process.env.SENTRYDNS })
Sentry.setContext('character', {
  runtime: 'renderer',
  isStudio: process.env.STUDIO === 'true',
  version,
})

let ISMAXIMIZED = false

contextBridge.exposeInMainWorld('env', {
  isMac: process.platform === 'darwin',
  // isMac: true,
  isDev: process.env.NODE_ENV === 'development',
  isStudio: process.env.STUDIO === 'true',
  version,
  port: process.env.PORT || 1212,
  sentryDns: process.env.SENTRYDNS,
  isMaximized: () => ISMAXIMIZED,
})

ipcRenderer.on('isMaximized', (event: Event, isMaximized: boolean) => {
  ISMAXIMIZED = isMaximized
  if (isMaximized) {
    document.body.classList.add('maximized')
  } else {
    document.body.classList.remove('maximized')
  }
})

contextBridge.exposeInMainWorld('derealize', {
  sendBackIpc,
  listenBackIpc,
  unlistenBackIpc,

  listenMainIpc: (key: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(key, listener)
  },
  unlistenMainIpc: (key: string) => {
    ipcRenderer.removeAllListeners(key)
  },
  sendMainIpc: (key: string, ...args: any[]) => {
    ipcRenderer.send(key, ...args)
  },
  sendMainIpcSync: (key: string, ...args: any[]): any => {
    return ipcRenderer.sendSync(key, ...args)
  },
})

ipcRenderer.on('setParams', (event: Event, socketId) => {
  connectSocket(socketId)
})

// https://stackoverflow.com/a/45352250
export interface PreloadWindow extends Window {
  env: {
    isDev: boolean
    isMac: boolean
    isStudio: boolean
    version: string
    port: boolean
    sentryDns: string
    isMaximized: () => boolean
  }
  derealize: {
    sendBackIpc: (handler: Handler, payload: Record<string, unknown>) => Promise<unknown>
    listenBackIpc: (broadcast: Broadcast, cb: (payload: any) => void) => () => void
    unlistenBackIpc: (broadcast: Broadcast) => void
    listenMainIpc: (key: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    unlistenMainIpc: (key: string) => void
    sendMainIpc: (key: string, ...args: any[]) => void
    sendMainIpcSync: (key: string, ...args: any[]) => any
  }
}
