import os from 'os'
import fs from 'fs'
import path from 'path'

const isDarwin = os.platform() === 'darwin'
const nodePath = `assets/node-v14.17.3-${isDarwin ? 'darwin' : 'win'}-x64`
const npmBin = isDarwin ? 'bin/npm' : 'npm.cmd'
const nodeBin = isDarwin ? 'bin/node' : 'node.exe'

export const getNpmBin = () => {
  let ph = path.resolve(__dirname, `../${nodePath}/${npmBin}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${nodePath}/${npmBin}`)
  }
  return ph
}

export const getNodeBin = () => {
  let ph = path.resolve(__dirname, `../${nodePath}/${nodeBin}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${nodePath}/${nodeBin}`)
  }
  return ph
}
