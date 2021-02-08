import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import broadcast from './broadcast'

const isProd = process.env.ELECTRON_ENV === 'production'
let nodeBin = os.platform() === 'darwin' ? 'node/bin/node' : 'node/npm.cmd'
if (!isProd) {
  nodeBin = os.platform() === 'darwin' ? '../../assets/node-mac/bin/npm' : '../../assets/node-win/npm.cmd'
}

export const npmInstall = ({ cwd }: Record<string, string>): Promise<void> => {
  const install = spawn(path.resolve(__dirname, nodeBin), ['install'], { cwd })

  install.stdout.on('data', (stdout) => {
    broadcast('npmInstall', { stdout: stdout.toString() })
    console.log(`npmInstall stdout: ${stdout}`)
  })

  install.stderr.on('data', (stderr) => {
    broadcast('npmInstall', { stderr: stderr.toString() })
    console.log(`npmInstall stderr: ${stderr}`)
  })

  install.on('error', (error) => {
    broadcast('npmInstall', { error: error.message })
    console.error('npmInstall error', error)
  })

  install.on('close', (code) => {
    broadcast('npmInstall', { exited: code })
    console.log(`npmInstall process exited. ${code}`)
  })

  return Promise.resolve()
}

export const npmStart = ({ cwd, script }: Record<string, string>): Promise<void> => {
  const install = spawn(path.resolve(__dirname, nodeBin), ['run', script], {
    cwd,
  })

  install.stdout.on('data', (stdout) => {
    broadcast('npmStart', { stdout: stdout.toString() })
    console.log(`npmInstall stdout: ${stdout}`)
  })

  install.stderr.on('data', (stderr) => {
    broadcast('npmStart', { stderr: stderr.toString() })
    console.log(`npmInstall stderr: ${stderr}`)
  })

  install.on('error', (error) => {
    broadcast('npmStart', { error: error.message })
    console.error('npmInstall error', error)
  })

  install.on('close', (code) => {
    broadcast('npmStart', { exited: code })
    console.log(`npmInstall process exited. ${code}`)
  })

  return Promise.resolve()
}
