/* eslint-disable no-console */
import ipc from './ipc'
import log from './log'

if (process.argv[2] === '--subprocess') {
  process
    .on('uncaughtException', (error) => {
      log('Backend UncaughtException', error)
    })
    .on('unhandledRejection', (reason) => {
      log('Backend UnhandledRejection', JSON.stringify(reason))
    })

  const socketId = process.argv[4]
  ipc(socketId)
  log(`backend subprocess version:${process.argv[3]} socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('set-socket', (event: Event, payload: { socketId: string }) => {
        ipc(payload.socketId)
        console.log(`backend window socket: ${payload.socketId}`)
      })
      return null
    })
    .catch(console.error)
}
