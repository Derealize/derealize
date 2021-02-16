import fs from 'fs'
import _path from 'path'
import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository, StatusFile } from 'nodegit'
import ProjectConfig from './project.config'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitPull, gitPush, gitCommit } from './git'
import broadcast from './broadcast'
import log from './log'

enum ProjectStage {
  None,
  Initialized,
  Ready,
  Running,
}

interface GitFileChanges {
  file: string
  status: string
}

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

  tailwindcssVersion: string | undefined

  installProcess: ChildProcessWithoutNullStreams | undefined

  runningProcess: ChildProcessWithoutNullStreams | undefined

  constructor(readonly url: string, private path: string, branch = 'derealize') {
    this.config.branch = branch
  }

  async Import() {
    try {
      this.repo = await gitClone(this.url, this.path, this.config.branch)
      await checkBranch(this.repo, this.config.branch)
      broadcast('import', { result: 'done' })
    } catch (error) {
      if (error.message.includes('exists and is not an empty directory')) {
        try {
          this.repo = await gitOpen(this.path)
        } catch (err) {
          broadcast('import', { error: error.message })
          log('git open error', error)
        }
      } else {
        broadcast('import', { error: error.message })
        log('git clone error', error)
      }
    }

    try {
      const jsonraw = fs.readFileSync(_path.join(this.path, './package.json'), 'utf8')
      const pacakge = JSON.parse(jsonraw)

      Object.assign(this.config, pacakge.derealize)

      this.tailwindcssVersion = pacakge.dependencies.tailwindcss || pacakge.devDependencies.tailwindcss
      if (!this.tailwindcssVersion) {
        broadcast('import', { error: 'project not imported tailwindcss' })
        return
      }

      this.stage = ProjectStage.Initialized
    } catch (error) {
      broadcast('import', { error: error.message })
      log('package error', error)
    }

    if (this.repo) {
      await this.Install()
    }
  }

  async FileStatus() {
    if (!this.repo) return
    try {
      const statuses = await this.repo.getStatus()
      this.changes = statuses.map((item) => {
        return {
          file: item.path(),
          status: Project.fileStatusToText(item),
        }
      })
      broadcast('fileStatus', { result: this.changes })
    } catch (error) {
      broadcast('fileStatus', { error: error.message })
      log('fileStatus error', error)
    }
  }

  async Pull() {
    if (!this.repo) return

    await this.FileStatus()
    if (this.changes.length) {
      broadcast('pull', { error: 'has changes' })
      return
    }

    try {
      await gitPull(this.repo)
      broadcast('pull', { result: 'done' })
    } catch (error) {
      if (error.message.includes('is the current HEAD of the repository')) {
        broadcast('pull', { result: 'done' })
      } else {
        broadcast('pull', { error: error.message })
        log('gitPull error', error)
      }
    }
  }

  async Push(msg: string) {
    if (!this.repo) return

    await this.FileStatus()

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      await this.FileStatus()
      if (this.changes.length) {
        broadcast('push', { error: 'has conflicted. Please contact the engineer for help.' })
        return
      }

      await gitPush(this.repo)

      broadcast('push', { result: 'done' })
    } catch (error) {
      broadcast('push', { error: error.message })
      log('gitPush', error)
    }
  }

  async Install() {
    this.installProcess = npmInstall(this.path)
    let hasError = false

    this.installProcess.stdout.on('data', (stdout) => {
      broadcast('install', { stdout: stdout.toString() })
    })

    this.installProcess.stderr.on('data', (stderr) => {
      broadcast('install', { stderr: stderr.toString() })
    })

    this.installProcess.on('error', (error) => {
      hasError = true
      broadcast('install', { error: error.message })
      log('npmInstall error', error)
    })

    this.installProcess.on('close', (code) => {
      broadcast('install', { exited: code })
      if (!hasError) {
        this.stage = ProjectStage.Ready
      }
    })
  }

  async Run() {
    this.runningProcess = npmStart(this.path, this.config.npmScript)

    this.runningProcess.stdout.on('data', (stdout) => {
      this.stage = ProjectStage.Running
      broadcast('npmStart', { stdout: stdout.toString() })
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      broadcast('npmStart', { stderr: stderr.toString() })
    })

    this.runningProcess.on('error', (error) => {
      broadcast('npmStart', { error: error.message })
      log('npmStart error', error)
    })

    this.runningProcess.on('close', (code) => {
      broadcast('npmStart', { exited: code })
      this.stage = ProjectStage.Ready
    })
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
