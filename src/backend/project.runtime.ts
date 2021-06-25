import fs from 'fs/promises'
import sysPath from 'path'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository } from 'nodegit'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import resolveConfig from 'tailwindcss/resolveConfig'
import killPort from 'kill-port'
import type {
  ProjectConfigWithRuntime,
  GitFileChanges,
  StatusPayload,
  ProcessPayload,
  BoolReply,
  HistoryReply,
} from './backend.interface'
import { ProjectStatus } from './backend.interface'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitPull, gitPush, gitCommit, gitHistory, fileStatusToText } from './git'
import emit from './emit'
import log from './log'

const compiledMessage = ['Compiled', 'compiled', 'successfully']

export enum Broadcast {
  Status = 'Status',
  Installing = 'Installing',
  Starting = 'Starting',
  FocusElement = 'FocusElement',
}

class Project {
  status: ProjectStatus = ProjectStatus.None

  repo: Repository | undefined

  changes: Array<GitFileChanges> = []

  config: ProjectConfigWithRuntime = {
    runScript: 'dev',
    formatScript: 'format',
    baseUrl: 'http://localhost:3000',
    port: 3000,
    pages: [],
    assetsPath: '',
    assetsUrl: '',
    applyCssFile: '',
    isWeapp: false,
  }

  productName: string | undefined

  tailwindVersion: string | undefined

  tailwindConfig: TailwindConfig | undefined

  installProcess: ChildProcessWithoutNullStreams | undefined

  runningProcess: ChildProcessWithoutNullStreams | undefined

  constructor(readonly projectId: string, readonly url: string, readonly path: string, readonly branch = 'derealize') {}

  EmitStatus(): void {
    emit(Broadcast.Status, {
      projectId: this.projectId,
      changes: this.changes,
      status: this.status,
      productName: this.productName,
      tailwindVersion: this.tailwindVersion,
      tailwindConfig: this.tailwindConfig,
      config: this.config,
    } as StatusPayload)
  }

  private async assignConfig(): Promise<BoolReply> {
    try {
      const jsonraw = await fs.readFile(sysPath.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)
      Object.assign(this.config, pacakge.derealize)

      this.productName = pacakge.productName || pacakge.name
      this.tailwindVersion = pacakge.dependencies.tailwindcss || pacakge.devDependencies.tailwindcss
      if (!this.tailwindVersion) {
        // todo:parse and check min supported version
        return { result: false, error: 'project not imported tailwindcss' }
      }
    } catch (err) {
      log('assignConfig error', err)
      return { result: false, error: err.message }
    }

    return { result: true }
  }

  ResolveTailwindConfig(): BoolReply {
    try {
      const configPath = sysPath.resolve(this.path, './tailwind.config.js')

      // https://cnodejs.org/topic/52aa6e78a9526bff2232aaa9
      delete __non_webpack_require__.cache[configPath]
      // https://github.com/webpack/webpack/issues/4175#issuecomment-277232067
      const config = __non_webpack_require__(configPath)
      this.tailwindConfig = resolveConfig(config)
      return { result: true }
    } catch (err) {
      log(`ResolveTailwindConfig fail:${this.path}`, err)
      return { result: false, error: err.message }
    }
  }

  async FlushGit(): Promise<BoolReply> {
    if (!this.repo) return { result: false, error: 'repo null' }

    try {
      await checkBranch(this.repo, this.branch)
    } catch (err) {
      log('git branch error', err)
      return { result: false, error: err.message }
    }

    try {
      const statuses = await this.repo.getStatus()
      this.changes = statuses.map((item) => {
        return {
          file: item.path(),
          status: fileStatusToText(item),
        }
      })
    } catch (err) {
      log('git status error', err)
      return { result: false, error: err.message }
    }

    this.EmitStatus()
    return { result: true }
  }

  async Flush(): Promise<BoolReply> {
    const reply = await this.FlushGit()
    if (!reply.result) return reply

    const configReply = await this.assignConfig()
    if (!configReply.result) return configReply

    const tailwindConfigReply = this.ResolveTailwindConfig()
    if (!tailwindConfigReply.result) return tailwindConfigReply

    this.EmitStatus()
    return { result: true }
  }

  async Import(): Promise<BoolReply> {
    try {
      this.repo = await gitClone(this.url, this.path, this.branch)
    } catch (err) {
      if (err.message.includes('exists and is not an empty directory')) {
        try {
          this.repo = await gitOpen(this.path)
        } catch (openErr) {
          log('git open error', openErr)
          return { result: false, error: openErr.message }
        }
      } else {
        log('git clone error', err)
        return { result: false, error: err.message }
      }
    }

    const reply = await this.FlushGit()
    if (!reply.result) return reply

    const configReply = await this.assignConfig()
    if (!configReply.result) return configReply

    this.status = ProjectStatus.Initialized
    this.EmitStatus()

    return { result: true }
  }

  Install(): BoolReply {
    if (this.status === ProjectStatus.Starting || this.status === ProjectStatus.Running) {
      return { result: false, error: 'Starting or Running' }
    }

    this.runningProcess?.kill()

    this.installProcess = npmInstall(this.path)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      emit(Broadcast.Installing, { projectId: this.projectId, stdout: stdout.toString() } as ProcessPayload)
    })

    this.installProcess.stderr.on('data', (stderr) => {
      emit(Broadcast.Installing, { projectId: this.projectId, stderr: stderr.toString() } as ProcessPayload)
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      emit(Broadcast.Installing, { projectId: this.projectId, error: error.message, exit: 0 } as ProcessPayload)
      log('installing error', error)
    })

    this.installProcess.on('exit', (exit) => {
      emit(Broadcast.Installing, { projectId: this.projectId, exit } as ProcessPayload)
      if (!hasError) {
        log('status = ProjectStatus.Ready')
        this.status = ProjectStatus.Ready
        this.EmitStatus()
      }
    })

    return { result: true }
  }

  async Start(): Promise<BoolReply> {
    if (this.status === ProjectStatus.Starting || this.status === ProjectStatus.Running) {
      return { result: false, error: 'Starting or Running' }
    }

    this.runningProcess?.kill()
    await killPort(this.config.port)

    this.runningProcess = npmStart(this.path, this.config.runScript)
    this.status = ProjectStatus.Starting

    this.runningProcess.stdout.on('data', (stdout) => {
      const message = stdout.toString()
      emit(Broadcast.Starting, { projectId: this.projectId, stdout: message } as ProcessPayload)

      if (this.status !== ProjectStatus.Running && compiledMessage.some((m) => message.includes(m))) {
        this.status = ProjectStatus.Running
      }
      this.EmitStatus()
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      const message = stderr.toString()
      emit(Broadcast.Starting, { projectId: this.projectId, stderr: message } as ProcessPayload)
      if (this.status !== ProjectStatus.Running && compiledMessage.some((m) => message.includes(m))) {
        this.status = ProjectStatus.Running
      }
      this.EmitStatus()
    })

    this.runningProcess.on('error', (error) => {
      log('starting error', error)
      emit(Broadcast.Starting, { projectId: this.projectId, error: error.message } as ProcessPayload)
      this.status = ProjectStatus.Ready
      this.EmitStatus()
    })

    this.runningProcess.on('exit', (exit) => {
      emit(Broadcast.Starting, { projectId: this.projectId, exit } as ProcessPayload)
      this.status = ProjectStatus.Ready
      this.EmitStatus()
    })

    return { result: true }
  }

  async Stop() {
    this.runningProcess?.kill()
    await killPort(this.config.port)

    this.status = ProjectStatus.Ready
    this.EmitStatus()
  }

  async Dispose() {
    this.installProcess?.kill()
    this.runningProcess?.kill()
    await killPort(this.config.port)
  }

  async Pull(): Promise<BoolReply> {
    if (!this.repo) throw new Error('repo null')

    const reply = await this.FlushGit()
    if (!reply.result) return reply

    if (this.changes.length) {
      return { result: false, error: 'Some files have changed, please push first.' }
    }

    try {
      await gitPull(this.repo)
      this.Install()

      return { result: true }
    } catch (error) {
      if (error.message.includes('is the current HEAD of the repository')) {
        return { result: true }
      }
      log('gitPull error', error)
      return { result: false, error: error.message }
    }
  }

  async Push(msg: string): Promise<BoolReply> {
    if (!this.repo) throw new Error('repo null')

    const reply = await this.FlushGit()
    if (!reply.result) return reply

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      const reply2 = await this.FlushGit()
      if (!reply2.result) return reply2

      if (this.changes.length) {
        return { result: false, error: 'has conflicted. Please contact the engineer for help.' }
      }

      await gitPush(this.repo)

      return { result: true }
    } catch (error) {
      log('gitPush error', error)
      return { result: false, error: error.message }
    }
  }

  async History(): Promise<HistoryReply> {
    if (!this.repo) throw new Error('repo null')

    try {
      const commits = await gitHistory(this.repo)
      return { result: commits }
    } catch (err) {
      return { result: [], error: err.message }
    }
  }
}

export default Project
