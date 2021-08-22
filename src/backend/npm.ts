import fetch from 'node-fetch'
import { execSync, spawn, ChildProcessWithoutNullStreams } from 'child_process'
// import shelljs from 'shelljs'
import { getNpmBin } from './assetspath'

const checkFirewall = async () => {
  try {
    await fetch('//ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js', {
      timeout: 3000,
    })
    return true
  } catch (err) {
    return false
  }
}

const npm = getNpmBin()

export const npmInstall = async (cwd: string): Promise<ChildProcessWithoutNullStreams> => {
  const freedom = await checkFirewall()
  if (!freedom) {
    execSync(`${npm} config set registry https://registry.npm.taobao.org`, { cwd })
  } else {
    execSync(`${npm} config set registry https://registry.npmjs.org`, { cwd })
  }
  return spawn(npm, ['install'], { cwd })
}

export const npmStart = (cwd: string, script: string): ChildProcessWithoutNullStreams => {
  return spawn(npm, ['run', script, '--scripts-prepend-node-path'], {
    cwd,
  })
}
