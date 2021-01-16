/* eslint-disable no-console */
import ipc from './ipc'
import message from './message'

if (process.argv[2] === '--subprocess') {
  process
    .on('uncaughtException', (error) => {
      message({ message: 'Backend UncaughtException', error: error.message })
    })
    .on('unhandledRejection', (reason) => {
      message({ message: 'Backend UnhandledRejection', error: JSON.stringify(reason) })
    })

  const socketId = process.argv[4]
  ipc(socketId)
  message({ message: `backend subprocess version:${process.argv[3]} socket:${socketId}` })
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
