import jscodeshift from 'jscodeshift/dist/Runner'
import ReactTransformer from './react-transformer'

const isDev = process.env.NODE_ENV === 'development'

export default async (path: string, line: number, column: number, className: string) => {
  const response = await jscodeshift.run(ReactTransformer, [path], {
    line,
    column,
    className,
    silent: true,
    runInBand: true,
    verbose: isDev,
    parser: 'tsx',
  })
}
