import {
  Clone,
  Repository,
  Remote,
  Reference,
  Signature,
  Cred,
  Branch,
  StatusFile,
  ProxyOptions,
} from '@derealize/nodegit'
import type { CommitLog } from './backend.interface'

const proxyOpts = {}
// https://github.com/nodegit/nodegit/blob/master/CHANGELOG.md#changes-or-improvements
// const proxyOpts = new ProxyOptions()
// proxyOpts.url = 'socks5://127.0.0.1:10808'

export const checkoutBranch = async (repo: Repository, branch: string): Promise<void> => {
  let ref = await repo.getCurrentBranch()
  if (ref.name() !== `refs/heads/${branch}`) {
    // https://github.com/nodegit/nodegit/issues/1261#issuecomment-431831338
    const commit = await repo.getBranchCommit(`origin/${branch}`)
    ref = await repo.createBranch(branch, commit, true)
    await repo.checkoutBranch(ref)
    await Branch.setUpstream(ref, `origin/${branch}`)
  }
}

export const open = async (path: string): Promise<Repository> => {
  const repo = await Repository.open(path)
  return repo
}

export const clone = async (url: string, path: string, branch: string): Promise<Repository> => {
  const repo = await Clone.clone(url, path, {
    checkoutBranch: branch,
    fetchOpts: {
      proxyOpts,
    },
  })
  return repo
}

export const commit = async (repo: Repository, msg: string) => {
  // https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
  const index = await repo.refreshIndex()
  await index.addAll()
  await index.write()
  const oid = await index.writeTree()
  const head = await Reference.nameToId(repo, 'HEAD')
  const parent = await repo.getCommit(head)
  const committer = await Signature.default(repo)
  await repo.createCommit('HEAD', committer, committer, msg, oid, [parent])
}

export const pull = async (repo: Repository, branch: string) => {
  await repo.fetch('origin', {
    proxyOpts,
    callbacks: {
      credentials(_url: any, userName: string) {
        return Cred.sshKeyFromAgent(userName)
      },
    },
  })

  // https://github.com/nodegit/nodegit/blob/master/examples/pull.js
  await repo.mergeBranches(branch, `origin/${branch}`)
}

export const push = async (repo: Repository, branch: string) => {
  // https://github.com/nodegit/nodegit/blob/master/examples/push.js
  const remote = await repo.getRemote('origin')
  const pushId = await remote.push([`refs/heads/${branch}:refs/heads/${branch}`], {
    proxyOpts,
    callbacks: {
      credentials(_url: any, userName: string) {
        return Cred.sshKeyFromAgent(userName)
      },
    },
  })
}

export const switchOrigin = async (repo: Repository, url: string) => {
  await Remote.delete(repo, 'origin')
  await Remote.create(repo, 'origin', url)
}

// recommend engineers use 'rebase' instead 'merge' when merging code into the work branch
export const history = (repo: Repository): Promise<Array<CommitLog>> => {
  // https://github.com/nodegit/nodegit/blob/master/examples/walk-history.js
  return new Promise((resolve, reject) => {
    repo
      .getHeadCommit()
      .then((head) => {
        head
          .history()
          .on('end', (commits) => {
            const historys = commits.map((commit: any) => {
              return {
                sha: commit.sha(),
                author: commit.author().name(),
                date: commit.date(),
                message: commit.message(),
              }
            })
            resolve(historys)
          })
          .on('error', (err) => {
            reject(err)
          })
          .start()
        return undefined
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// https://github.com/nodegit/nodegit/blob/master/examples/status.js
export const fileStatusToText = (status: StatusFile): string => {
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
