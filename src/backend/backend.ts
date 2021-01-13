/* eslint-disable no-console */
import log from 'electron-log'
import ipc from './ipc'

if (process.argv[2] === '--subprocess') {
  process.on('uncaughtException', (err) => {
    log.error('Backend UncaughtException', err)
  })

  const socketId = process.argv[4]
  ipc(socketId)
  log.log(`backend subprocess version:${process.argv[3]} socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('set-socket', (event: Event, payload: { socketId: string }) => {
        console.log(`backend window socket: ${payload.socketId}`)
        ipc(payload.socketId)
      })
      return null
    })
    .catch((err) => {
      console.error(err)
    })
}
