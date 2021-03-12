import uuid from 'uuid'
import PreloadWindow from './preload_interface'

declare const window: PreloadWindow
const replyHandlers = new Map()
const listeners = new Map()
let messageQueue: Array<string> = []
let socketClient: any = null

const connectSocket = (socketId: string) => {
  window.electron.ipcConnect(socketId, (client) => {
    client.on('message', (data: string) => {
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
          listens.forEach((listener: any) => {
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

export function send(name: string, payload: any = {}) {
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

export function listen(name: string, cb: any) {
  if (!listeners.get(name)) {
    listeners.set(name, [])
  }
  listeners.get(name).push(cb)

  // unlisten only this cb
  return () => {
    const arr = listeners.get(name)
    listeners.set(
      name,
      arr.filter((cb_: any) => cb_ !== cb),
    )
  }
}

export function unlisten(name: string) {
  listeners.set(name, [])
}

;(async () => {
  const socketId = await window.electron.getSocketId()
  connectSocket(socketId)
})()
