import { ipcRenderer, contextBridge } from 'electron'
import type { Project } from './models/project'
import { Handler, Broadcast } from './backend/backend.interface'
import { connectSocket, send, listen, unlisten } from './client-ipc'

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
  send,
  listen,
  unlisten,

  // https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args
  // getStoreAsync: async (key: string): Promise<unknown> => {
  //   ipcRenderer.send('getStore', key)
  //   return Promise.race([
  //     new Promise((resolve) => {
  //       ipcRenderer.once(`getStore-${key}`, (event, data) => {
  //         resolve(data)
  //       })
  //     }),
  //     new Promise((resolve, reject) =>
  //       setTimeout(() => {
  //         reject(new Error('getStore timed out.'))
  //       }, 2000),
  //     ),
  //   ])
  // },

  getStore: (key: string): unknown | undefined => {
    return ipcRenderer.sendSync('getStore', key)
  },
  setStore: (payload: Record<string, unknown>) => {
    ipcRenderer.send('setStore', payload)
  },
  controls: (payload: string) => {
    ipcRenderer.send('controls', payload)
  },
  popupMenu: (prijectId?: string) => {
    ipcRenderer.send('popupMenu', prijectId)
  },
  selectDirs: () => {
    const filePaths = ipcRenderer.sendSync('selectDirs')
    return filePaths
  },
  openDirs: (payload: string) => {
    ipcRenderer.send('openDirs', payload)
  },
  frontProjectWeb: (project: Project) => {
    if (project && project.config) {
      ipcRenderer.send('frontProjectWeb', project.url, project.config.lunchUrl)
    }
  },
  frontMain: () => {
    ipcRenderer.send('frontMain')
  },
  closeProjectView: (id: string) => {
    ipcRenderer.send('closeProjectView', id)
  },
  loadURL: (projectId: string, url: string) => {
    ipcRenderer.send('loadURL', projectId, url)
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
    send: (handler: Handler, payload: Record<string, unknown>) => Promise<unknown>
    listen: (broadcast: Broadcast, cb: (payload: any) => void) => () => void
    unlisten: (broadcast: Broadcast) => void
    getStore: (key: string) => unknown | undefined
    setStore: (payload: Record<string, unknown>) => void
    controls: (payload: string) => void
    popupMenu: (prijectId?: string) => void
    selectDirs: () => string
    openDirs: (payload: string) => void
    frontProjectWeb: (project: Project) => void
    frontMain: () => void
    closeProjectView: (id: string) => void
    loadURL: (projectId: string, url: string) => void
  }
}
