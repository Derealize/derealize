/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import * as fs from 'fs/promises'
import { constants } from 'fs'
import log, { captureException } from './log'

class SSHKey {
  constructor(readonly privateKeyPath: string, readonly publicKeyPath: string) {}

  static async ExploreDirectory(directory: string): Promise<SSHKey[]> {
    try {
      await fs.access(directory, constants.R_OK)

      const keys: Array<SSHKey> = []
      const files = await fs.readdir(directory)
      for (const file of files) {
        const filename = path.join(directory, file)
        const stat = await fs.stat(filename)
        if (!stat.isDirectory() && path.extname(filename) === '.pub') {
          const privateKeyName = path.basename(filename)
          await fs.access(privateKeyName, constants.R_OK)

          const key = new SSHKey(path.resolve(directory, privateKeyName), path.resolve(directory, filename))
          keys.push(key)
        }
      }
      return keys
    } catch (err) {
      captureException(err)
    }
    return []
  }
}

export default SSHKey
