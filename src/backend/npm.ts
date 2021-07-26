import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
// import shelljs from 'shelljs'
import { getNpmBin } from './nodepath'

const npm = getNpmBin()

export const npmInstall = (cwd: string): ChildProcessWithoutNullStreams => {
  const process = spawn(npm, ['install'], { cwd })
  return process
}

export const npmStart = (cwd: string, script: string): ChildProcessWithoutNullStreams => {
  const process = spawn(npm, ['run', script, '--scripts-prepend-node-path'], {
    cwd,
  })
  return process
}
