import fs from 'fs'
import _path from 'path'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository, StatusFile } from 'nodegit'
import {
  ProjectConfig,
  ProjectStage,
  GitFileChanges,
  Payload,
  StatusPayload,
  ProcessPayload,
} from './project.interface'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitPull, gitPush, gitCommit } from './git'
import broadcast from './broadcast'
import log from './log'

class Project {
  stage: ProjectStage = ProjectStage.None

  repo: Repository | undefined

  changes: Array<GitFileChanges> = []

  config: ProjectConfig = {
    branch: 'derealize',
    npmScript: 'dev',
    lunchUrl: 'http://localhost:3000',
    page: [],
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

      broadcast(channel, { id: this.url, error: 'project not imported tailwindcss' } as Payload)
    } catch (error) {
      broadcast(channel, { id: this.url, error: error.message } as Payload)
      log('config error', error)
    }

    this.Stop()
    this.stage = ProjectStage.None
    return false
  }

  async Import() {
    try {
      this.repo = await gitClone(this.url, this.path, this.config.branch)
      await checkBranch(this.repo, this.config.branch)
      broadcast('import', { id: this.url, result: 'done' } as Payload)
    } catch (error) {
      if (error.message.includes('exists and is not an empty directory')) {
        try {
          this.repo = await gitOpen(this.path)
        } catch (err) {
          broadcast('import', { id: this.url, error: error.message } as Payload)
          log('git open error', error)
        }
      } else {
        broadcast('import', { id: this.url, error: error.message } as Payload)
        log('git clone error', error)
      }
    }

    if (!this.repo) return
    if (!this.assignConfig('import')) return
    this.stage = ProjectStage.Initialized

    await this.Install()
  }

  async Status() {
    if (!this.repo) return

    this.assignConfig('status')

    try {
      const statuses = await this.repo.getStatus()
      this.changes = statuses.map((item) => {
        return {
          file: item.path(),
          status: Project.fileStatusToText(item),
        }
      })
      broadcast('status', {
        id: this.url,
        changes: this.changes,
        stage: this.stage,
        productName: this.productName,
        tailwindVersion: this.tailwindVersion,
        config: this.config,
      } as StatusPayload)
    } catch (error) {
      broadcast('status', { id: this.url, error: error.message })
      log('status error', error)
    }
  }

  async Pull() {
    if (!this.repo) return

    await this.Status()
    if (this.changes.length) {
      broadcast('pull', { id: this.url, error: 'has changes' } as Payload)
      return
    }

    try {
      await gitPull(this.repo)
      broadcast('pull', { id: this.url, result: 'done' } as Payload)
    } catch (error) {
      if (error.message.includes('is the current HEAD of the repository')) {
        broadcast('pull', { id: this.url, result: 'done' })
      } else {
        broadcast('pull', { id: this.url, error: error.message } as Payload)
        log('gitPull error', error)
      }
    }
  }

  async Push(msg: string) {
    if (!this.repo) return

    await this.Status()

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      await this.Status()
      if (this.changes.length) {
        broadcast('push', { id: this.url, error: 'has conflicted. Please contact the engineer for help.' } as Payload)
        return
      }

      await gitPush(this.repo)

      broadcast('push', { id: this.url, result: 'done' } as Payload)
    } catch (error) {
      broadcast('push', { id: this.url, error: error.message } as Payload)
      log('gitPush', error)
    }
  }

  async Install() {
    this.installProcess = npmInstall(this.path)
    broadcast('install', { id: this.url, reset: true } as ProcessPayload)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      broadcast('install', { id: this.url, stdout: stdout.toString() } as ProcessPayload)
    })

    this.installProcess.stderr.on('data', (stderr) => {
      broadcast('install', { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      broadcast('install', { id: this.url, error: error.message } as ProcessPayload)
      log('npmInstall error', error)
    })

    this.installProcess.on('exit', (exit) => {
      broadcast('install', { id: this.url, exit } as ProcessPayload)
      if (!hasError) {
        this.stage = ProjectStage.Ready
      }
    })
  }

  async Start() {
    this.runningProcess = npmStart(this.path, this.config.npmScript)
    broadcast('running', { id: this.url, reset: true } as ProcessPayload)

    this.runningProcess.stdout.on('data', (stdout) => {
      this.stage = ProjectStage.Running
      broadcast('running', { id: this.url, stdout: stdout.toString() } as ProcessPayload)
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      broadcast('running', { id: this.url, stderr: stderr.toString() } as ProcessPayload)
    })

    this.runningProcess.on('error', (error) => {
      broadcast('running', { id: this.url, error: error.message } as ProcessPayload)
      log('start error', error)
    })

    this.runningProcess.on('exit', (exit) => {
      broadcast('running', { id: this.url, exit } as ProcessPayload)
      this.stage = ProjectStage.Ready
    })
  }

  Stop() {
    this.runningProcess?.kill()
    this.stage = ProjectStage.Ready
  }

  Dispose() {
    this.installProcess?.kill()
    this.runningProcess?.kill()
  }

  // https://github.com/nodegit/nodegit/blob/master/examples/status.js
  static fileStatusToText = (status: StatusFile): string => {
    const words = []
    if (status.isNew()) {
      words.push('NEW')
    }
    if (status.isModified()) {
      words.push('MODIFIED')
    }
    if (status.isTypechange()) {
      words.push('TYPECHANGE')
    }
    if (status.isRenamed()) {
      words.push('RENAMED')
    }
    if (status.isIgnored()) {
      words.push('IGNORED')
    }
    if (status.isConflicted()) {
      words.push('CONFLICTED')
    }
    return words.join(' ')
  }
}

export default Project
