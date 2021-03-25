import { ipcRenderer, contextBridge } from 'electron'
import { connectSocket, send, listen } from './client-ipc'
import { Handler, UpdateClassPayload } from './backend/handlers'
import { Broadcast } from './backend/backend.interface'

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

let activeElement: HTMLElement | null = null

listen(Broadcast.LiveUpdateClass, (payload: UpdateClassPayload) => {
  if (payload.id === PROJECTID && activeElement) {
    activeElement.className = payload.className
  }
})

const derealizeListener = (e: Event) => {
  if (!e.target || !PROJECTID) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()
  activeElement = e.target as HTMLElement

  const code = activeElement.getAttribute('data-code')
  if (code) {
    const { tagName, className } = activeElement
    send(Handler.FocusElement, { id: PROJECTID, code, tagName, className })
  }
}

const listenElement = () => {
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
  listenElement()
})

contextBridge.exposeInMainWorld('derealize', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  listenElement,
})
