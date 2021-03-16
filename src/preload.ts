import { ipcRenderer, contextBridge } from 'electron'
import Project from './models/project.interface'
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
  openDirs: () => {
    ipcRenderer.send('openDirs')
  },
  frontProjectView: (project?: Project) => {
    if (project && project.config) {
      ipcRenderer.send('frontProjectView', project.url, project.config.lunchUrl)
    } else {
      ipcRenderer.send('frontProjectView')
    }
  },
  closeProjectView: (projectId: string) => {
    ipcRenderer.send('closeProjectView', projectId)
  },
})

ipcRenderer.on('set-params', (event: Event, { socketId }: Record<string, string>) => {
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
    send: (name: string, payload: Record<string, unknown>) => Promise<unknown>
    listen: (name: string, cb: (payload: any) => void) => () => void
    unlisten: (name: string) => void
    getStore: (key: string) => unknown | undefined
    setStore: (payload: Record<string, unknown>) => void
    controls: (payload: string) => void
    popupMenu: (prijectId?: string) => void
    selectDirs: () => string
    openDirs: (payload: string) => void
    frontProjectView: (project?: Project) => void
    closeProjectView: (projectId: string) => void
  }
}
