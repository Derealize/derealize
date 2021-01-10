import log from 'electron-log'
import ipc from './ipc'

if (process.argv[2] === '--subprocess') {
  process.on('uncaughtException', (err) => {
    log.error(err)
  })
  const socketId = process.argv[4]
  ipc(socketId)
  log.log(`subprocess version:${process.argv[3]} socket:${socketId}`)
} else {
  ;(async () => {
    const { ipcRenderer } = await import('electron')
    ipcRenderer.on('set-socket', (event: Event, payload: { socketId: string }) => {
      console.log(`BackendWindow socket: ${payload.socketId}`)
      ipc(payload.socketId)
    })
  })()
}
