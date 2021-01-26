import { Clone, Repository, Reference, Signature, Cred, Branch } from 'nodegit'
import broadcast from './broadcast'
import message from './message'

const checkBranch = async (repo: Repository): Promise<string> => {
  let ref = await repo.getCurrentBranch()
  if (ref.name() !== 'refs/heads/derealize') {
    try {
      // https://github.com/nodegit/nodegit/issues/1261#issuecomment-431831338
      const commit = await repo.getBranchCommit('origin/derealize')
      ref = await repo.createBranch('derealize', commit, true)
      await repo.checkoutBranch(ref)
      await Branch.setUpstream(ref, 'origin/derealize')
    } catch (error) {
      throw new Error(
        'current branch is not "derealize". Please contact the engineer for help, or delete and re-import the project files',
      )
    }
  }

  return ref.name()
}

export const gitOpen = async ({ path }: Record<string, string>): Promise<void> => {
  try {
    const repo = await Repository.open(path)
    const branchName = await checkBranch(repo)
    broadcast('gitOpen', { result: branchName })
  } catch (error) {
    broadcast('gitOpen', { error: error.message })
    message({ message: 'gitOpen', error })
  }
}

export const gitClone = async ({ url, path }: Record<string, string>): Promise<void> => {
  try {
    const repo = await Clone.clone(url, path, { checkoutBranch: 'derealize' })
    const branchName = await checkBranch(repo)
    broadcast('gitClone', { result: branchName })
  } catch (error) {
    if (error.message.includes('exists and is not an empty directory')) {
      await gitOpen({ path })
      return
    }
    broadcast('gitClone', { error: error.message })
    message({ message: 'gitClone', error })
  }
}

// https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
export const gitSync = async ({ path, msg }: Record<string, string>) => {
  try {
    const repo = await Repository.open(path)
    await checkBranch(repo)

    const index = await repo.refreshIndex()
    await index.addAll('.')
    await index.write()
    const tree = await index.writeTree()
    const head = await Reference.nameToId(repo, 'HEAD')
    const commit = await repo.getCommit(head)
    const committer = Signature.default(repo)
    await repo.createCommit('HEAD', committer, committer, msg, tree, [commit])

    await repo.fetch('origin', {
      callbacks: {
        credentials(_url: any, userName: string) {
          return Cred.sshKeyFromAgent(userName)
        },
      },
    })

    // https://github.com/nodegit/nodegit/blob/master/examples/pull.js
    await repo.mergeBranches('derealize', 'origin/derealize')

    const remote = await repo.getRemote('derealize')
    const pushId = await remote.push(['refs/heads/derealize:refs/heads/derealize'], {
      callbacks: {
        credentials(_url: any, userName: string) {
          return Cred.sshKeyFromAgent(userName)
        },
      },
    })

    broadcast('gitSync', { result: pushId })
  } catch (error) {
    broadcast('gitSync', { error: error.message })
    message({ message: 'gitSync', error })
  }
}

export const gitPull = async ({ path }: Record<string, string>) => {
  try {
    const repo = await Repository.open(path)
    await checkBranch(repo)

    await repo.fetch('origin', {
      callbacks: {
        credentials(_url: any, userName: string) {
          return Cred.sshKeyFromAgent(userName)
        },
      },
    })

    const oid = await repo.mergeBranches('derealize', 'origin/derealize')
    broadcast('gitPull', { result: oid })
  } catch (error) {
    if (error.message.includes('is the current HEAD of the repository')) {
      broadcast('gitPull', { result: 'done' })
      return
    }
    broadcast('gitPull', { error: error.message })
    message({ message: 'gitPull', error })
  }
}
