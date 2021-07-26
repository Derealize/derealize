import os from 'os'
import fs from 'fs'
import path from 'path'

const isDarwin = os.platform() === 'darwin'
const version = isDarwin ? 'v14.17.3-darwin-x64' : 'v14.17.3-win-x64'
const npmPath = isDarwin ? `assets/node-${version}/bin/npm` : `assets/node-${version}/npm.cmd`
const nodePath = isDarwin ? `assets/node-${version}/bin/node` : `assets/node-${version}/node.exe`

export const getNpmPath = () => {
  let ph = path.resolve(__dirname, `../${npmPath}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${npmPath}`)
  }
  return ph
}

export const getNodePath = () => {
  let ph = path.resolve(__dirname, `../${nodePath}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${nodePath}`)
  }
  return ph
}
