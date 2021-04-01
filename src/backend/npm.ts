import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
// import shelljs from 'shelljs'
import { getNpmPath } from './nodepath'

const npmPath = getNpmPath()

export const npmInstall = (cwd: string): ChildProcessWithoutNullStreams => {
  const process = spawn(npmPath, ['install'], { cwd })
  return process
}

export const npmStart = (cwd: string, script: string): ChildProcessWithoutNullStreams => {
  const process = spawn(npmPath, ['run', script, '--scripts-prepend-node-path'], {
    cwd,
  })
  return process
}
