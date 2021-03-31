import jscodeshift from 'jscodeshift/dist/Runner'
import ReactTransformer from './react-transformer'
import log from './log'

const isDev = process.env.NODE_ENV === 'development'

export default async (codePosition: string, className: string) => {
  const position = codePosition.split(':')
  const resp = await jscodeshift.run(ReactTransformer, [position[0]], {
    line: parseInt(position[1], 10),
    column: parseInt(position[2], 10),
    className,
    silent: true,
    runInBand: true,
    verbose: isDev,
    parser: 'tsx',
  })

  if (resp.ok) {
    log(`${codePosition} in ${resp.timeElapsed}s`)
  } else if (resp.nochange) {
    log(`did not change. ${codePosition}`)
  } else if (resp.error) {
    log(`error. ${codePosition}`, resp.error)
  }
}
