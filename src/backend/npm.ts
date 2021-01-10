import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import broadcast from './broadcast'

const isProd = process.env.ELECTRON_ENV === 'production'
let nodeBin = os.platform() === 'darwin' ? 'node/bin/node' : 'node/npm.cmd'
if (!isProd) {
  nodeBin = os.platform() === 'darwin' ? '../../assets/node-mac/bin/npm' : '../../assets/node-win/npm.cmd'
}

export const Install = (cwd: string) => {
  const install = spawn(path.resolve(__dirname, nodeBin), ['install'], { cwd })

  install.stdout.on('data', (stdout) => {
    broadcast('npm_install', { stdout: stdout.toString() })
    console.log(`npm_install stdout: ${stdout}`)
  })

  install.stderr.on('data', (stderr) => {
    broadcast('npm_install', { stderr: stderr.toString() })
    console.log(`npm_install stderr: ${stderr}`)
  })

  install.on('error', (error) => {
    broadcast('npm_install', { error: error.message })
    console.error('npm_install error', error)
  })

  install.on('close', (code) => {
    broadcast('npm_install', { exited: code })
    console.log(`npm_install process exited. ${code}`)
  })
}

export const Start = (cwd: string, script: string) => {
  const install = spawn(path.resolve(__dirname, nodeBin), ['run', script], {
    cwd,
  })

  install.stdout.on('data', (stdout) => {
    broadcast('npm_start', { stdout: stdout.toString() })
    console.log(`npm_start stdout: ${stdout}`)
  })

  install.stderr.on('data', (stderr) => {
    broadcast('npm_start', { stderr: stderr.toString() })
    console.log(`npm_start stderr: ${stderr}`)
  })

  install.on('error', (error) => {
    broadcast('npm_start', { error: error.message })
    console.error('npm_start error', error)
  })

  install.on('close', (code) => {
    broadcast('npm_start', { exited: code })
    console.log(`npm_start process exited. ${code}`)
  })
}
