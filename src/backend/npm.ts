import os from 'os'
import path from 'path'
import shelljs from 'shelljs'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

const isProd = process.env.ELECTRON_ENV === 'production'
let nodeBin = os.platform() === 'darwin' ? 'node/bin/node' : 'node/npm.cmd'
if (!isProd) {
  nodeBin = os.platform() === 'darwin' ? '../assets/node-mac/bin/npm' : '../assets/node-win/npm.cmd'
}

export const npmInstall = (cwd: string): ChildProcessWithoutNullStreams => {
  const process = spawn(path.resolve(__dirname, nodeBin), ['install'], { cwd })
  return process
}

export const npmStart = (cwd: string, script: string): ChildProcessWithoutNullStreams => {
  const process = spawn(path.resolve(__dirname, nodeBin), ['run', script, '--scripts-prepend-node-path'], {
    cwd,
  })
  return process
}
