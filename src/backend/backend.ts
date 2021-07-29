import log, { captureException, setExtra } from './log'
import ipc from './backend-ipc'
import { DisposeAll } from './handlers'

log(`process.pid:${process.pid}`)

process.on('exit', async () => {
  await DisposeAll()
})

if (process.argv[2] === '--subprocess') {
  if (process.argv[4] === '--version') {
    setExtra('version', process.argv[5])
  }
  const socketId = process.argv[3]
  ipc(socketId)
  log(`backend subprocess socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('setParams', (e: Event, { socketId, version }) => {
        setExtra('version', version)
        ipc(socketId)
        log(`backend window socket: ${socketId}`)
      })
      return null
    })
    .catch(captureException)
}
