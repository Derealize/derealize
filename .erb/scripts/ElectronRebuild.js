import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs'
import { dependencies } from '../../src/package.json'

const nodeModulesPath = path.join(__dirname, '../../src/node_modules')

// backend process don't need electron-rebuild
const depKeys = Object.keys(dependencies || {}).filter((k) => k !== 'nodegit')
console.log('electron-rebuild depKeys:', depKeys)

if (depKeys.length > 0 && fs.existsSync(nodeModulesPath)) {
  const electronRebuildCmd =
    '../node_modules/.bin/electron-rebuild --parallel --force --types prod,dev,optional --module-dir .'
  const cmd = process.platform === 'win32' ? electronRebuildCmd.replace(/\//g, '\\') : electronRebuildCmd
  execSync(cmd, {
    cwd: path.join(__dirname, '../../src'),
    stdio: 'inherit',
  })
}
