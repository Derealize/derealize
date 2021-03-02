const { ipcRenderer, contextBridge } = require('electron')
const ipc = require('node-ipc')

const isDev = process.env.NODE_ENV === 'development'

contextBridge.exposeInMainWorld('env', {
  isMac: process.platform === 'darwin',
  isDev,
})

contextBridge.exposeInMainWorld('derealize', {
  injectScript: isDev ? 'inject.js' : 'dist/inject.prod.js',
})
