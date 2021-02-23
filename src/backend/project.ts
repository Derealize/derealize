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
    name: '',
    branch: 'derealize',
    npmScript: 'dev',
    port: 3000,
    assets: '',
  }

  tailwindVersion: string | undefined

  installProcess: ChildProcessWithoutNullStreams | undefined

  runningProcess: ChildProcessWithoutNullStreams | undefined

  constructor(readonly url: string, private path: string, branch = 'derealize') {
    this.config.branch = branch
  }

  private AssignConfig(channel: string): boolean {
    try {
      const jsonraw = fs.readFileSync(_path.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)

      Object.assign(this.config, pacakge.derealize)

      this.tailwindVersion = pacakge.dependencies.tailwindcss || pacakge.devDependencies.tailwindcss
      if (this.tailwindVersion) return true

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
      broadcast('import', { result: 'done' } as Payload)
    } catch (error) {
      if (error.message.includes('exists and is not an empty directory')) {
        try {
          this.repo = await gitOpen(this.path)
        } catch (err) {
          broadcast('import', { error: error.message } as Payload)
          log('git open error', error)
        }
      } else {
        broadcast('import', { error: error.message } as Payload)
        log('git clone error', error)
      }
    }

    if (this.AssignConfig('import')) {
      this.stage = ProjectStage.Initialized
      if (this.repo) {
        await this.Install()
      }
    }
  }

  async Status() {
    if (!this.repo) return

    this.AssignConfig('status')

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
        tailwindVersion: this.tailwindVersion,
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
      broadcast('pull', { error: 'has changes' } as Payload)
      return
    }

    try {
      await gitPull(this.repo)
      broadcast('pull', { result: 'done' } as Payload)
    } catch (error) {
      if (error.message.includes('is the current HEAD of the repository')) {
        broadcast('pull', { result: 'done' })
      } else {
        broadcast('pull', { error: error.message } as Payload)
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
        broadcast('push', { error: 'has conflicted. Please contact the engineer for help.' } as Payload)
        return
      }

      await gitPush(this.repo)

      broadcast('push', { result: 'done' } as Payload)
    } catch (error) {
      broadcast('push', { error: error.message } as Payload)
      log('gitPush', error)
    }
  }

  async Install() {
    this.installProcess = npmInstall(this.path)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      broadcast('install', { stdout: stdout.toString() } as ProcessPayload)
    })

    this.installProcess.stderr.on('data', (stderr) => {
      broadcast('install', { stderr: stderr.toString() } as ProcessPayload)
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      broadcast('install', { error: error.message } as ProcessPayload)
      log('npmInstall error', error)
    })

    this.installProcess.on('exit', (code) => {
      broadcast('install', { exited: code } as ProcessPayload)
      if (!hasError) {
        this.stage = ProjectStage.Ready
      }
    })
  }

  async Start() {
    this.runningProcess = npmStart(this.path, this.config.npmScript)

    this.runningProcess.stdout.on('data', (stdout) => {
      this.stage = ProjectStage.Running
      broadcast('npmStart', { stdout: stdout.toString() } as ProcessPayload)
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      broadcast('npmStart', { stderr: stderr.toString() } as ProcessPayload)
    })

    this.runningProcess.on('error', (error) => {
      broadcast('npmStart', { error: error.message } as ProcessPayload)
      log('npmStart error', error)
    })

    this.runningProcess.on('exit', (code) => {
      broadcast('npmStart', { exited: code } as ProcessPayload)
      this.stage = ProjectStage.Ready
    })
  }

  Stop() {
    this.runningProcess?.kill()
    this.stage = ProjectStage.Ready
  }

  dispose() {
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
