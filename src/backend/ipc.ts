import ipc from 'node-ipc'
import log from './log'

const handlers: any = require('./handlers')

export default (socketId: string) => {
  ipc.config.id = socketId
  ipc.config.silent = true

  ipc.serve(() => {
    ipc.server.on('message', (data: string, socket) => {
      // log.debug(data)
      const msg = JSON.parse(data)
      const { id, name, payload } = msg

      if (handlers[name]) {
        handlers[name](payload)
          .then((result: any) => {
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result }))
            return null
          })
          .catch((error: Error) => {
            // Up to you how to handle errors, if you want to forward them, etc
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'error', id }))
            log(`handlers ${name}`, error)
            // throw error
          })
      } else {
        log(`Unknown method: ${name}`)
        ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result: null }))
      }
    })
  })

  ipc.server.start()
}
