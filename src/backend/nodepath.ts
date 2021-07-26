import os from 'os'
import fs from 'fs'
import path from 'path'

const isDarwin = os.platform() === 'darwin'
const nodePath = `assets/node-v14.17.3-${isDarwin ? 'darwin' : 'win'}-x64`
const npmBin = isDarwin ? `${nodePath}/bin/npm` : `${nodePath}/npm.cmd`
const nodeBin = isDarwin ? `${nodePath}/bin/node` : `${nodePath}/node.exe`

export const getNpmBin = () => {
  let ph = path.resolve(__dirname, `../${npmBin}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${npmBin}`)
  }
  return ph
}

export const getNodeBin = () => {
  let ph = path.resolve(__dirname, `../${nodeBin}`)
  if (!fs.existsSync(ph)) {
    ph = path.resolve(__dirname, `../../${nodeBin}`)
  }
  return ph
}
