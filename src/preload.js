const { ipcRenderer } = require('electron')
const ipc = require('node-ipc')

window.env = {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 1212,
}

let resolveSocketPromise
const socketPromise = new Promise((resolve) => {
  resolveSocketPromise = resolve
})

const electron = {}
electron.getSocketId = () => {
  return socketPromise
}

ipcRenderer.on('set-socket', (event, { socketId }) => {
  resolveSocketPromise(socketId)
})

electron.ipcConnect = (id, func) => {
  ipc.config.silent = true
  ipc.connectTo(id, () => {
    func(ipc.of[id])
  })
}

// https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args
electron.getStore = async (key) => {
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
}

electron.setStore = (payload) => {
  ipcRenderer.send('setStore', payload)
}

electron.controls = (payload) => {
  ipcRenderer.send('controls', payload)
}

ipcRenderer.on('isMaximized', (event, isMaximized) => {
  if (isMaximized) {
    document.body.classList.add('maximized')
  } else {
    document.body.classList.remove('maximized')
  }
})

electron.popupMenu = (projectId) => {
  ipcRenderer.send('popupMenu', projectId)
}

electron.selectDirs = () => {
  const filePaths = ipcRenderer.sendSync('selectDirs')
  return filePaths
}

electron.frontProjectView = (projectId, lunchUrl) => {
  ipcRenderer.send('frontProjectView', projectId, lunchUrl)
}

electron.closeProjectView = (projectId) => {
  ipcRenderer.send('closeProjectView', projectId)
}

window.electron = electron
