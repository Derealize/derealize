const { ipcRenderer, contextBridge } = require('electron')

const isDev = process.env.NODE_ENV === 'development'

contextBridge.exposeInMainWorld('env', {
  isMac: process.platform === 'darwin',
  isDev,
})

contextBridge.exposeInMainWorld('derealize', {
  // injectScript: isDev ? path.join(__dirname, 'inject.dev.js') : path.join(__dirname, 'dist/inject.prod.js'),
})
