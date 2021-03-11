const { ipcRenderer } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

window.env = {
  isMac: process.platform === 'darwin',
  isDev,
}

// window.derealize = {
//   injectScript: path.join(__dirname, isDev ? 'inject.dev.js' : 'dist/inject.prod.js'),
// }

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('injected!', document.body.innerHTML)
})
