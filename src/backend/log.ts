import * as Sentry from '@sentry/node'
// import * as Tracing from '@sentry/tracing'

const isProd = process.env.NODE_ENV === 'production'
const isDebugProd = process.env.DEBUG_PROD === 'true'
const isStudio = process.env.STUDIO === 'true'

Sentry.init({
  dsn: 'https://***REMOVED***@o931741.ingest.sentry.io/***REMOVED***',
  // recommend adjusting this in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
})

Sentry.setContext('character', {
  isStudio,
  runtime: 'backend',
})

export const captureException = (error: Error, extra?: Record<string, unknown>) => {
  if (isProd) {
    if (isDebugProd && process.send) {
      process.send(error + JSON.stringify(extra))
    } else {
      Sentry.captureException(error, { extra })
    }
  } else {
    console.error(`backend error`, error, extra)
  }
}

export default (message: string) => {
  if (isDebugProd && process.send) {
    // fork option stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    process.send(message)
  } else {
    console.log(message)
  }
}

export const { setExtra } = Sentry
