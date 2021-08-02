import fs from 'fs/promises'
import sysPath from 'path'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import resolveConfig from 'tailwindcss/resolveConfig'
import log, { captureException } from './log'
import type { ProjectConfig, StatusPayload, BoolReply } from './backend.interface'
import emit from './emit'

export enum Broadcast {
  Status = 'Status',
  Installing = 'Installing',
  Starting = 'Starting',
  FocusElement = 'FocusElement',
}

class Project {
  config: ProjectConfig = {
    formatScript: 'format',
    baseUrl: 'http://localhost:3000',
    pages: [],
    assetsPath: '',
    assetsUrl: '',
    applyCssFile: '',
    isWeapp: false,
  }

  productName: string | undefined

  tailwindVersion: string | undefined

  tailwindConfig: TailwindConfig | undefined

  constructor(readonly projectId: string, readonly path: string) {}

  private async assignConfig(): Promise<BoolReply> {
    try {
      const jsonraw = await fs.readFile(sysPath.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)
      Object.assign(this.config, pacakge.derealize)

      this.productName = pacakge.productName || pacakge.name
      if (pacakge.dependencies && pacakge.dependencies.tailwindcss) {
        this.tailwindVersion = pacakge.dependencies.tailwindcss
      } else if (pacakge.devDependencies && pacakge.devDependencies.tailwindcss) {
        this.tailwindVersion = pacakge.devDependencies.tailwindcss
      } else {
        this.tailwindVersion = undefined
        // todo:parse and check min supported version
        return { result: false, error: 'project not imported tailwindcss' }
      }
    } catch (err) {
      captureException(err)
      return { result: false, error: err.message }
    }

    return { result: true }
  }

  ResolveTailwindConfig(): BoolReply {
    try {
      const configPath = sysPath.resolve(this.path, './tailwind.config.js')

      if (process.env.BACKEND_SUBPROCESS === 'true') {
        delete require.cache[configPath]
        const config = require(configPath)
        this.tailwindConfig = resolveConfig(config)
      } else {
        // https://cnodejs.org/topic/52aa6e78a9526bff2232aaa9
        delete __non_webpack_require__.cache[configPath]
        // https://github.com/webpack/webpack/issues/4175#issuecomment-277232067
        const config = __non_webpack_require__(configPath)
        this.tailwindConfig = resolveConfig(config)
      }

      return { result: true }
    } catch (err) {
      captureException(err, { path: this.path })
      return { result: false, error: err.message }
    }
  }

  async Flush(): Promise<BoolReply> {
    const configReply = await this.assignConfig()
    if (!configReply.result) return configReply

    const tailwindConfigReply = this.ResolveTailwindConfig()
    if (!tailwindConfigReply.result) return tailwindConfigReply

    this.EmitStatus()
    return { result: true }
  }

  EmitStatus(): void {
    emit(Broadcast.Status, {
      projectId: this.projectId,
      productName: this.productName,
      tailwindVersion: this.tailwindVersion,
      tailwindConfig: this.tailwindConfig,
      config: this.config,
    } as StatusPayload)
  }
}

export default Project
