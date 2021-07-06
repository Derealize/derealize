/* eslint-disable no-console */
import ipc from './backend-ipc'
import log from './log'

process
  .on('uncaughtException', (error) => {
    log('Backend UncaughtException', error)
  })
  .on('unhandledRejection', (reason) => {
    log('Backend UnhandledRejection', JSON.stringify(reason))
  })
  .on('exit', async () => {
    log('exit')
  })

if (process.argv[2] === '--subprocess') {
  const socketId = process.argv[3]
  ipc(socketId, process.argv[4] === '--with-runtime')
  log(`backend subprocess socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('setParams', (e: Event, payload: { socketId: string; withRuntime: boolean }) => {
        ipc(payload.socketId, payload.withRuntime)
        console.log(`backend window socket: ${payload.socketId}`)
      })
      return null
    })
    .catch((err) => log('error', err))
}
