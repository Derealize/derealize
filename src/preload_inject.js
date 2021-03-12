const { ipcRenderer } = require('electron')
const ipc = require('node-ipc')
const { uuid } = require('uuid')

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'

const replyHandlers = new Map()
const listeners = new Map()
let messageQueue: Array<string> = []
let socketClient: any = null
let PROJECTID: string | null = null

const connectSocket = (socketId) => {
  ipc.config.silent = true
  ipc.connectTo(socketId, () => {
    const client = ipc.of[socketId]

    client.on('message', (data) => {
      const msg = JSON.parse(data)

      if (msg.type === 'error') {
        // Up to you whether or not to care about the error
        const { id } = msg
        replyHandlers.delete(id)
      } else if (msg.type === 'reply') {
        const { id, result } = msg

        const handler = replyHandlers.get(id)
        if (handler) {
          replyHandlers.delete(id)
          handler.resolve(result)
        }
      } else if (msg.type === 'push') {
        const { name, payload } = msg

        const listens = listeners.get(name)
        if (listens) {
          listens.forEach((listener) => {
            listener(payload)
          })
        }
      } else {
        throw new Error(`Unknown message type: ${JSON.stringify(msg)}`)
      }
    })

    client.on('connect', () => {
      socketClient = client

      // Send any messages that were queued while closed
      if (messageQueue.length > 0) {
        messageQueue.forEach((msg) => client.emit('message', msg))
        messageQueue = []
      }

      console.log(`Connected! ${socketId}`)
    })

    client.on('disconnect', () => {
      socketClient = null
    })
  })
}

ipcRenderer.on('set-params', (event, { socketId, projectId }) => {
  PROJECTID = projectId
  connectSocket(socketId)
})

const sendToBackend = (name, payload = {}) => {
  return new Promise((resolve, reject) => {
    const id = uuid.v4()
    replyHandlers.set(id, { resolve, reject })
    if (socketClient) {
      socketClient.emit('message', JSON.stringify({ id, name, payload }))
    } else {
      messageQueue.push(JSON.stringify({ id, name, payload }))
    }
  })
}

const css = `
  [data-code]:hover {
    box-shadow: 0 0 0 1px #4fd1c5;
  }
`

const derealizeListener = (e) => {
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()
  const code = e.target.getAttribute('data-code')
  console.log('focusElement', PROJECTID, code, e.target.tagName)
  sendToBackend('focusElement', { url: PROJECTID, code })
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
