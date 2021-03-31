import path from 'path'
import jscodeshift from 'jscodeshift/dist/Runner'
import log from './log'
import Project from './project'

const isDev = process.env.NODE_ENV === 'development'

export default async (project: Project, codePosition: string, className: string) => {
  const position = codePosition.split(':')

  const transformerPath = path.resolve(__dirname, '../react_transformer.js')
  log(transformerPath)
  const filePath = path.resolve(project.path, position[0])
  log(filePath)

  const resp = await jscodeshift.run(transformerPath, [filePath], {
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
