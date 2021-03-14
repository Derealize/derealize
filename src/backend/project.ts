import fs from 'fs'
import _path from 'path'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository } from 'nodegit'
import killPort from 'kill-port'
import {
  ProjectConfig,
  ProjectStage,
  GitFileChanges,
  Payload,
  StatusPayload,
  ProcessPayload,
  BoolReply,
  PayloadError,
  HistoryReply,
} from './project.interface'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitPull, gitPush, gitCommit, gitHistory, fileStatusToText } from './git'
import broadcast from './broadcast'
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

  installProcess: ChildProcessWithoutNullStreams | undefined

  runningProcess: ChildProcessWithoutNullStreams | undefined

  constructor(readonly url: string, private path: string, branch = 'derealize') {
    this.config.branch = branch
  }

  private assignConfig(channel: string): boolean {
    try {
      const jsonraw = fs.readFileSync(_path.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)

      Object.assign(this.config, pacakge.derealize)

      this.productName = pacakge.productName || pacakge.name
      this.tailwindVersion = pacakge.dependencies.tailwindcss || pacakge.devDependencies.tailwindcss
      if (this.tailwindVersion) return true // todo:parse and check min supported version

      broadcast(channel, { id: this.url, error: 'project not imported tailwindcss' } as PayloadError)
    } catch (error) {
      broadcast(channel, { id: this.url, error: error.message } as PayloadError)
      log('config error', error)
    }

    this.Stop()
    this.stage = ProjectStage.None
    return false
  }

  async Status(chackGit = true): Promise<boolean> {
    if (!this.repo) return false

    try {
      await checkBranch(this.repo, this.config.branch)
    } catch (err) {
      broadcast('import', { id: this.url, error: err.message } as PayloadError)
      log('git branch error', err)
      return false
    }

    if (!this.assignConfig('import')) return false

    if (chackGit) {
      try {
        const statuses = await this.repo.getStatus()
        this.changes = statuses.map((item) => {
          return {
            file: item.path(),
            status: fileStatusToText(item),
          }
        })
      } catch (error) {
        broadcast('status', { id: this.url, error: error.message })
        log('git status error', error)
        return false
      }
    }

    broadcast('status', {
      id: this.url,
      changes: this.changes,
      stage: this.stage,
      productName: this.productName,
      tailwindVersion: this.tailwindVersion,
      config: this.config,
    } as StatusPayload)

    return true
  }

  async Import() {
    try {
      this.repo = await gitClone(this.url, this.path, this.config.branch)
      broadcast('import', { id: this.url, result: 'done' } as Payload)
    } catch (error) {
      if (error.message.includes('exists and is not an empty directory')) {
        try {
          this.repo = await gitOpen(this.path)
        } catch (err) {
          broadcast('import', { id: this.url, error: error.message } as PayloadError)
          log('git open error', error)
        }
      } else {
        broadcast('import', { id: this.url, error: error.message } as PayloadError)
        log('git clone error', error)
      }
    }

    const fine = await this.Status()
    if (fine) {
      this.stage = ProjectStage.Initialized
      this.Install()
    }
  }

  async Pull(): Promise<BoolReply> {
    if (!this.repo) throw new Error('repo null')

    await this.Status()
    if (this.changes.length) {
      return { result: false, error: 'has changes' }
    }

    try {
      await gitPull(this.repo)
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

    await this.Status()

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      await this.Status()
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

  async Install() {
    if (this.stage === ProjectStage.Starting || this.stage === ProjectStage.Running) return

    this.runningProcess?.kill()

    this.installProcess = npmInstall(this.path)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      broadcast('install', { id: this.url, stdout: stdout.toString() } as ProcessPayload)
    })

    this.installProcess.stderr.on('data', (stderr) => {
      broadcast('install', { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      broadcast('install', { id: this.url, error: error.message, exit: 0 } as ProcessPayload)
      log('npmInstall error', error)
    })

    this.installProcess.on('exit', (exit) => {
      broadcast('install', { id: this.url, exit } as ProcessPayload)
      if (!hasError) {
        this.stage = ProjectStage.Ready
        this.Status(false)
      }
    })
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
      broadcast('starting', { id: this.url, stdout: message } as ProcessPayload)

      this.stage = compiledMessage.some((m) => message.includes(m)) ? ProjectStage.Running : ProjectStage.Starting
      this.Status(false)
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      broadcast('starting', { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.runningProcess.on('error', (error) => {
      broadcast('starting', { id: this.url, error: error.message } as ProcessPayload)
      log('starting error', error)
    })

    this.runningProcess.on('exit', (exit) => {
      broadcast('starting', { id: this.url, exit } as ProcessPayload)
      this.stage = ProjectStage.Ready
      this.Status(false)
    })

    return { result: true }
  }

  Stop() {
    this.runningProcess?.kill()
    killPort(this.config.port)

    this.stage = ProjectStage.Ready
    this.Status(false)
  }

  Dispose() {
    this.installProcess?.kill()
    this.runningProcess?.kill()
    killPort(this.config.port)
  }
}

export default Project
