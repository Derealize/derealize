const { ipcRenderer } = require('electron')
// const path = require('path')

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'

const css = `
  [data-code]:hover {
    box-shadow: 0 0 0 1px #4fd1c5;
  }
`

const derealizeListener = (e) => {
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()
  const code = e.target.getAttribute('data-code')
  console.log(e.target.tagName, code)
}

window.derealize = {
  listen: () => {
    document.querySelectorAll('[data-code]').forEach((el) => {
      el.removeEventListener('click', derealizeListener)
      el.addEventListener('click', derealizeListener)

      el.removeEventListener('contextmenu', derealizeListener)
      el.addEventListener('contextmenu', derealizeListener)
    })
  },
}

document.addEventListener('DOMContentLoaded', () => {
  // console.log('injected!', document.body.innerHTML)

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)

  window.derealize.listen()
})
