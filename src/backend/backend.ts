import log, { captureException } from './log'
import ipc from './backend-ipc'
import { DisposeAll } from './handlers'

log(`process.pid:${process.pid}`)

process.on('exit', async () => {
  await DisposeAll()
})

if (process.argv[2] === '--subprocess') {
  const socketId = process.argv[3]
  ipc(socketId)
  log(`backend subprocess socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('setParams', (e: Event, { socketId }) => {
        ipc(socketId)
        log(`backend window socket: ${socketId}`)
      })
      return null
    })
    .catch(captureException)
}
