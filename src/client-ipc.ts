import uuid from 'uuid'
import ipc from 'node-ipc'

const replyHandlers = new Map()
const listeners = new Map()
let messageQueue: Array<string> = []
let socketClient: any = null

export const connectSocket = (socketId: string) => {
  ipc.config.silent = true
  ipc.connectTo(socketId, () => {
    const client = ipc.of[socketId]

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
          listens.forEach((listener: (payload: Record<string, unknown>) => void) => {
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

export const send = (name: string, payload: Record<string, unknown> = {}): Promise<unknown> => {
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

export function listen(name: string, cb: (payload: any) => void): () => void {
  if (!listeners.get(name)) {
    listeners.set(name, [])
  }
  listeners.get(name).push(cb)

  // unlisten only this cb
  return () => {
    const arr = listeners.get(name)
    listeners.set(
      name,
      arr.filter((cb_: () => void) => cb_ !== cb),
    )
  }
}

export function unlisten(name: string) {
  listeners.set(name, [])
}
