import os from 'os'
import fs from 'fs'
import path from 'path'

const isDarwin = os.platform() === 'darwin'

export const getNpmPath = () => {
  let nodePath = path.resolve(__dirname, isDarwin ? 'node/bin/npm' : 'node/npm.cmd')
  if (!fs.existsSync(nodePath)) {
    nodePath = path.resolve(__dirname, isDarwin ? '../../assets/node-mac/bin/npm' : '../../assets/node-win/npm.cmd')
  }
  return nodePath
}

export const getNodePath = () => {
  let nodePath = path.resolve(__dirname, isDarwin ? 'node/bin/node' : 'node/node.exe')
  if (!fs.existsSync(nodePath)) {
    nodePath = path.resolve(__dirname, isDarwin ? '../../assets/node-mac/bin/node' : '../../assets/node-win/node.exe')
  }
  return nodePath
}
