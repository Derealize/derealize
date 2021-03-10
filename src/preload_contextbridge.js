const { ipcRenderer, contextBridge } = require('electron')
const ipc = require('node-ipc')

contextBridge.exposeInMainWorld('env', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 1212,
})

let resolveSocketPromise
const socketPromise = new Promise((resolve) => {
  resolveSocketPromise = resolve
})

ipcRenderer.on('set-socket', (event, { socketId }) => {
  resolveSocketPromise(socketId)
})

ipcRenderer.on('isMaximized', (event, isMaximized) => {
  if (isMaximized) {
    document.body.classList.add('maximized')
  } else {
    document.body.classList.remove('maximized')
  }
})

contextBridge.exposeInMainWorld('electron', {
  getSocketId: () => socketPromise,
  // todo: https://github.com/jlongster/electron-with-server-example/issues/11
  ipcConnect: (id, func) => {
    ipc.config.silent = true
    ipc.connectTo(id, () => {
      func(ipc.of[id])
    })
  },
  // https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args
  getStore: async (key) => {
    ipcRenderer.send('getStore', key)
    return Promise.race([
      new Promise((resolve) => {
        ipcRenderer.once(`getStore-${key}`, (event, data) => {
          resolve(data)
        })
      }),
      new Promise((resolve, reject) =>
        setTimeout(() => {
          reject(new Error('getStore timed out.'))
        }, 2000),
      ),
    ])
  },
  setStore: (payload) => {
    ipcRenderer.send('setStore', payload)
  },
  controls: (payload) => {
    ipcRenderer.send('controls', payload)
  },
  popupMenu: () => {
    ipcRenderer.send('popupMenu')
  },
  selectDirs: () => {
    const filePaths = ipcRenderer.sendSync('selectDirs')
    return filePaths
  },
  openDirs: () => {
    ipcRenderer.send('openDirs')
  },
  frontProjectView: (url, lunchUrl) => {
    ipcRenderer.send('frontProjectView', url, lunchUrl)
  },
  closeProjectView: (url) => {
    ipcRenderer.send('closeProjectView', url)
  },
})
