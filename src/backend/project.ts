import fs from 'fs'
import sysPath from 'path'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository } from 'nodegit'
import killPort from 'kill-port'
import {
  Broadcast,
  ProjectConfig,
  ProjectStage,
  GitFileChanges,
  StatusPayload,
  ProcessPayload,
  BoolReply,
  HistoryReply,
} from './backend.interface'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitPull, gitPush, gitCommit, gitHistory, fileStatusToText } from './git'
import emit from './emit'
import log from './log'

const compiledMessage = ['compiled', 'successfully']

class Project {
  stage: ProjectStage = ProjectStage.None

  repo: Repository | undefined

  changes: Array<GitFileChanges> = []

  config: ProjectConfig = {
    branch: 'derealize',
    npmScript: 'dev',
    lunchUrl: 'http://localhost:3000',
    port: 3000,
    pages: [],
    assets: '',
    applyCssFile: '',
  }

  productName: string | undefined

  tailwindVersion: string | undefined

  tailwindConfigPath: string | undefined

  installProcess: ChildProcessWithoutNullStreams | undefined

  runningProcess: ChildProcessWithoutNullStreams | undefined

  constructor(readonly url: string, private path: string, branch = 'derealize') {
    this.config.branch = branch
  }

  EmitStatus(): void {
    emit(Broadcast.Status, {
      id: this.url,
      changes: this.changes,
      stage: this.stage,
      productName: this.productName,
      tailwindVersion: this.tailwindVersion,
      tailwindConfigPath: this.tailwindConfigPath,
      config: this.config,
    } as StatusPayload)
  }

  private assignConfig(): BoolReply {
    try {
      const jsonraw = fs.readFileSync(sysPath.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)

      Object.assign(this.config, pacakge.derealize)

      this.productName = pacakge.productName || pacakge.name
      this.tailwindVersion = pacakge.dependencies.tailwindcss || pacakge.devDependencies.tailwindcss
      if (!this.tailwindVersion) {
        // todo:parse and check min supported version
        return { result: false, error: 'project not imported tailwindcss' }
      }
      this.tailwindConfigPath = sysPath.join(this.path, './tailwind.config')
    } catch (error) {
      log('assignConfig error', error)
      return { result: false, error: error.message }
    }

    return { result: true }
  }

  async CheckStatus(): Promise<BoolReply> {
    if (!this.repo) return { result: false, error: 'repo null' }

    try {
      await checkBranch(this.repo, this.config.branch)
    } catch (err) {
      log('git branch error', err)
      return { result: false, error: err.message }
    }

    const reply = this.assignConfig()
    if (!reply.result) return reply

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

  async Import(): Promise<BoolReply> {
    try {
      this.repo = await gitClone(this.url, this.path, this.config.branch)
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

    const reply = await this.CheckStatus()
    if (!reply.result) return reply

    this.stage = ProjectStage.Initialized
    return { result: true }
  }

  async Install(): Promise<BoolReply> {
    if (this.stage === ProjectStage.Starting || this.stage === ProjectStage.Running) {
      return { result: false, error: 'Starting or Running' }
    }

    this.runningProcess?.kill()

    this.installProcess = npmInstall(this.path)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      emit(Broadcast.Installing, { id: this.url, stdout: stdout.toString() } as ProcessPayload)
    })

    this.installProcess.stderr.on('data', (stderr) => {
      emit(Broadcast.Installing, { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      emit(Broadcast.Installing, { id: this.url, error: error.message, exit: 0 } as ProcessPayload)
      log('installing error', error)
    })

    this.installProcess.on('exit', (exit) => {
      emit(Broadcast.Installing, { id: this.url, exit } as ProcessPayload)
      if (!hasError) {
        this.stage = ProjectStage.Ready
        this.EmitStatus()
      }
    })

    return { result: true }
  }

  async Start(): Promise<BoolReply> {
    if (this.stage === ProjectStage.Starting || this.stage === ProjectStage.Running) {
      return { result: false, error: 'Starting or Running' }
    }

    this.runningProcess?.kill()
    await killPort(this.config.port)

    this.runningProcess = npmStart(this.path, this.config.npmScript)

    this.runningProcess.stdout.on('data', (stdout) => {
      const message = stdout.toString()
      if (!message) return
      emit(Broadcast.Starting, { id: this.url, stdout: message } as ProcessPayload)

      this.stage = compiledMessage.some((m) => message.includes(m)) ? ProjectStage.Running : ProjectStage.Starting
      this.EmitStatus()
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      emit(Broadcast.Starting, { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.runningProcess.on('error', (error) => {
      log('starting error', error)
      emit(Broadcast.Starting, { id: this.url, error: error.message } as ProcessPayload)
      this.stage = ProjectStage.Ready
      this.EmitStatus()
    })

    this.runningProcess.on('exit', (exit) => {
      emit(Broadcast.Starting, { id: this.url, exit } as ProcessPayload)
      this.stage = ProjectStage.Ready
      this.EmitStatus()
    })

    return { result: true }
  }

  async Stop() {
    await killPort(this.config.port)
    this.runningProcess?.kill()

    this.stage = ProjectStage.Ready
    this.EmitStatus()
  }

  async Dispose() {
    await killPort(this.config.port)
    this.installProcess?.kill()
    this.runningProcess?.kill()
  }

  async Pull(): Promise<BoolReply> {
    if (!this.repo) throw new Error('repo null')

    const reply = await this.CheckStatus()
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

    const reply = await this.CheckStatus()
    if (!reply.result) return reply

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      const reply2 = await this.CheckStatus()
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
