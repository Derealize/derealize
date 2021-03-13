import os from 'os'
import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

const isDarwin = os.platform() === 'darwin'

let nodeBin = isDarwin ? 'node/bin/node' : 'node/npm.cmd'
if (!fs.existsSync(nodeBin)) {
  nodeBin = isDarwin ? '../../assets/node-mac/bin/npm' : '../../assets/node-win/npm.cmd'
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
