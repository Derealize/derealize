const { ipcRenderer } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

window.env = {
  isMac: process.platform === 'darwin',
  isDev,
}

const electron = {}
electron.injectScript = () => {
  return path.join(__dirname, isDev ? 'inject.dev.js' : 'dist/inject.prod.js')
}

window.electron = electron
