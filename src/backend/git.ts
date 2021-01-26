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
    broadcast('gitOpen', { result: 'done' })
  } catch (error) {
    broadcast('gitOpen', { error: error.message })
    message({ message: 'gitOpen', error })
  }
}

export const gitClone = async ({ url, path }: Record<string, string>): Promise<void> => {
  try {
    const repo = await Clone.clone(url, path, { checkoutBranch: 'derealize' })
    const branchName = await checkBranch(repo)
    broadcast('gitClone', { result: 'done' })
  } catch (error) {
    if (error.message.includes('exists and is not an empty directory')) {
      await gitOpen({ path })
      return
    }
    broadcast('gitClone', { error: error.message })
    message({ message: 'gitClone', error })
  }
}

const pull = async (repo: Repository) => {
  try {
    await repo.fetch('origin', {
      callbacks: {
        credentials(_url: any, userName: string) {
          return Cred.sshKeyFromAgent(userName)
        },
      },
    })

    // https://github.com/nodegit/nodegit/blob/master/examples/pull.js
    const oid = await repo.mergeBranches('derealize', 'origin/derealize')
    broadcast('gitPull', { result: 'done' })
  } catch (error) {
    if (error.message.includes('is the current HEAD of the repository')) {
      broadcast('gitPull', { result: 'wont' })
      return
    }
    broadcast('gitPull', { error: error.message })
    message({ message: 'gitPull', error })
  }
}

export const gitPull = async ({ path }: Record<string, string>) => {
  const repo = await Repository.open(path)
  await checkBranch(repo)
  await pull(repo)
}

export const gitSync = async ({ path, msg }: Record<string, string>) => {
  try {
    const repo = await Repository.open(path)
    await checkBranch(repo)

    // https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
    const index = await repo.refreshIndex()
    await index.addAll()
    await index.write()
    const oid = await index.writeTree()
    const head = await Reference.nameToId(repo, 'HEAD')
    const parent = await repo.getCommit(head)
    const committer = await Signature.default(repo)
    await repo.createCommit('HEAD', committer, committer, msg, oid, [parent])

    await pull(repo)

    // https://github.com/nodegit/nodegit/blob/master/examples/push.js
    const remote = await repo.getRemote('derealize')
    const pushId = await remote.push(['refs/heads/derealize:refs/heads/derealize'], {
      callbacks: {
        credentials(_url: any, userName: string) {
          return Cred.sshKeyFromAgent(userName)
        },
      },
    })

    broadcast('gitSync', { result: 'done' })
  } catch (error) {
    broadcast('gitSync', { error: error.message })
    message({ message: 'gitSync', error })
  }
}
