import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'
import { Handler, Broadcast } from './backend/backend.interface'
import { connectSocket, sendBackIpc, listenBackIpc, unlistenBackIpc } from './client-ipc'

let ISMAXIMIZED = false

contextBridge.exposeInMainWorld('env', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 1212,
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

ipcRenderer.on('setParams', (event: Event, { socketId }: Record<string, string>) => {
  connectSocket(socketId)
})

// https://stackoverflow.com/a/45352250
export interface PreloadWindow extends Window {
  env: {
    isDev: boolean
    isMac: boolean
    port: boolean
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
