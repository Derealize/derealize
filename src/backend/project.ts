import { ChildProcessWithoutNullStreams } from 'child_process'
import { Repository, StatusFile } from 'nodegit'
import { npmInstall, npmStart } from './npm'
import { gitClone, checkBranch, gitOpen, gitStatus, gitPull, gitPush, gitCommit } from './git'
import broadcast from './broadcast'
import message from './log'

enum ProjectStage {
  Initialized,
  Ready,
  Running,
}

interface GitFileChanges {
  file: string
  status: string
}

class Project {
  stage: ProjectStage

  repo: Repository | null

  changes: Array<GitFileChanges>

  installProcess: ChildProcessWithoutNullStreams | null

  runningProcess: ChildProcessWithoutNullStreams | null

  constructor(
    readonly url: string,
    private path: string,
    private branch: string = 'derealize',
    private npmScript: string = 'dev',
  ) {
    this.stage = ProjectStage.Initialized
    this.repo = null
    this.changes = []
    this.installProcess = null
    this.runningProcess = null
  }

  async Import() {
    try {
      this.repo = await gitClone(this.url, this.path, this.branch)
      await checkBranch(this.repo, this.branch)
      broadcast('import', { result: 'done' })
    } catch (error) {
      if (error.message.includes('exists and is not an empty directory')) {
        this.repo = await gitOpen(this.path)
      } else {
        broadcast('import', { error: error.message })
        message('import error', error)
      }
    }

    if (this.repo) {
      await this.Install()
    }
  }

  async FileChanges() {
    if (!this.repo) return
    try {
      const statuses = await gitStatus(this.repo)
      this.changes = statuses.map((item) => {
        return {
          file: item.path(),
          status: Project.statusToText(item),
        }
      })
      broadcast('fileChanges', { result: this.changes })
    } catch (error) {
      broadcast('fileChanges', { error: error.message })
      message('fileChanges error', error)
    }
  }

  async Pull() {
    if (!this.repo) return

    await this.FileChanges()
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
        message('gitPull error', error)
      }
    }
  }

  async Push(msg: string) {
    if (!this.repo) return

    await this.FileChanges()

    try {
      if (this.changes.length) {
        await gitCommit(this.repo, msg || 'derealize commit')
      }

      await gitPull(this.repo)

      await this.FileChanges()
      if (this.changes.length) {
        broadcast('push', { error: 'has conflicted. Please contact the engineer for help.' })
        return
      }

      await gitPush(this.repo)

      broadcast('push', { result: 'done' })
    } catch (error) {
      broadcast('push', { error: error.message })
      message('gitPush', error)
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
      message('npmInstall error', error)
    })

    this.installProcess.on('close', (code) => {
      broadcast('install', { exited: code })
      if (!hasError) {
        this.stage = ProjectStage.Ready
      }
    })
  }

  async Run() {
    this.runningProcess = npmStart(this.path, this.npmScript)

    this.runningProcess.stdout.on('data', (stdout) => {
      this.stage = ProjectStage.Running
      broadcast('npmStart', { stdout: stdout.toString() })
    })

    this.runningProcess.stderr.on('data', (stderr) => {
      broadcast('npmStart', { stderr: stderr.toString() })
    })

    this.runningProcess.on('error', (error) => {
      broadcast('npmStart', { error: error.message })
      message('npmStart error', error)
    })

    this.runningProcess.on('close', (code) => {
      broadcast('npmStart', { exited: code })
      this.stage = ProjectStage.Installed
    })
  }

  dispose() {
    this.installProcess?.kill()
    this.runningProcess?.kill()
  }

  // https://github.com/nodegit/nodegit/blob/master/examples/status.js
  static statusToText = (status: StatusFile): string => {
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
