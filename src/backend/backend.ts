import log from 'electron-log'
import * as Sentry from '@sentry/node'
// import * as Tracing from '@sentry/tracing'
import ipc from './backend-ipc'
import { DisposeAll } from './handlers'

Sentry.init({
  dsn: 'https://***REMOVED***@o931741.ingest.sentry.io/***REMOVED***',
  // recommend adjusting this in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
})

const backendLog = log.scope('backend')
backendLog.debug(`process.pid:${process.pid}`)

process.on('exit', async () => {
  await DisposeAll()
})

if (process.argv[2] === '--subprocess') {
  const socketId = process.argv[3]
  ipc(socketId)
  console.log(`backend subprocess socket:${socketId}`)
  backendLog.debug(`backend subprocess socket:${socketId}`)
} else {
  import('electron')
    .then(({ ipcRenderer }) => {
      ipcRenderer.on('setParams', (e: Event, { socketId }) => {
        ipc(socketId)
        console.log(`backend window socket: ${socketId}`)
        backendLog.debug(`backend window socket:${socketId}`)
      })
      return null
    })
    .catch(Sentry.captureException)
}
