import { ipcRenderer, contextBridge } from 'electron'
import { connectSocket, send } from './client-ipc'
import { Handler, FocusElementPayload } from './backend/handlers'

let PROJECTID: string | null = null

ipcRenderer.on('setParams', (event: Event, { socketId, projectId }: Record<string, string>) => {
  PROJECTID = projectId
  connectSocket(socketId)
})

const css = `
  [data-code]:hover {
    box-shadow: 0 0 0 1px #4fd1c5;
  }
`

const derealizeListener = (e: any) => {
  if (!e.target) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()
  const code = e.target.getAttribute('data-code')
  if (code && PROJECTID) {
    const { tagName, className } = e.target.tagName
    send(Handler.FocusElement, { id: PROJECTID, code, tagName, className })
  }
}

const listen = () => {
  document.querySelectorAll('[data-code]').forEach((el) => {
    el.removeEventListener('click', derealizeListener)
    el.addEventListener('click', derealizeListener)

    el.removeEventListener('contextmenu', derealizeListener)
    el.addEventListener('contextmenu', derealizeListener)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  // console.log('injected!', document.body.innerHTML)

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
  listen()
})

contextBridge.exposeInMainWorld('derealize', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  listen,
})
