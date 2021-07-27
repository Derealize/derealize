import * as Sentry from '@sentry/node'
import ipc from 'node-ipc'

const handlers: any = require('./handlers')

export default (socketId: string) => {
  ipc.config.id = socketId
  ipc.config.silent = true

  ipc.serve(() => {
    ipc.server.on('message', (data: string, socket) => {
      // console.log.debug(data)
      const msg = JSON.parse(data)
      const { id, name, payload } = msg

      if (handlers[name]) {
        // console.log(name + JSON.stringify(payload))
        handlers[name](payload)
          .then((result: any) => {
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result }))
            return null
          })
          .catch((error: Error) => {
            // Up to you how to handle errors, if you want to forward them, etc
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'error', id }))
            console.error(`handlers ${name}`, error)
            Sentry.captureException(error)
          })
      } else {
        console.error(`Unknown method: ${name}`)
        Sentry.captureException(new Error(`Unknown method: ${name}`))
        ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result: null }))
      }
    })
  })

  ipc.server.start()
}
