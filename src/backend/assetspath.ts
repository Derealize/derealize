import os from 'os'
import path from 'path'

const isDarwin = os.platform() === 'darwin'
const isProd = process.env.NODE_ENV === 'production'
const nodePath = `assets/node-v14.17.3-${isDarwin ? 'darwin' : 'win'}-x64`

export const getNpmBin = () =>
  path.resolve(__dirname, `${isProd ? '..' : '../..'}/${nodePath}/${isDarwin ? 'bin/npm' : 'npm.cmd'}`)

export const getNodeBin = () =>
  path.resolve(__dirname, `${isProd ? '..' : '../..'}/${nodePath}/${isDarwin ? 'bin/node' : 'node.exe'}`)

export const getSSHKeysPath = () => path.resolve(__dirname, `${isProd ? '..' : '../..'}/.ssh`)
