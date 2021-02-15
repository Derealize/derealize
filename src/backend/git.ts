import { Clone, Repository, Reference, Signature, Cred, Branch, StatusFile } from 'nodegit'

export const checkBranch = async (repo: Repository, branch: string): Promise<void> => {
  let ref = await repo.getCurrentBranch()
  if (ref.name() !== `refs/heads/${branch}`) {
    // https://github.com/nodegit/nodegit/issues/1261#issuecomment-431831338
    const commit = await repo.getBranchCommit(`origin/${branch}`)
    ref = await repo.createBranch(branch, commit, true)
    await repo.checkoutBranch(ref)
    await Branch.setUpstream(ref, `origin/${branch}`)
  }
}

export const gitOpen = async (path: string): Promise<Repository> => {
  const repo = await Repository.open(path)
  return repo
}

export const gitClone = async (url: string, path: string, branch: string): Promise<Repository> => {
  const repo = await Clone.clone(url, path, { checkoutBranch: branch })
  return repo
}

export const gitCommit = async (repo: Repository, msg: string) => {
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

export const gitPull = async (repo: Repository) => {
  await repo.fetch('origin', {
    callbacks: {
      credentials(_url: any, userName: string) {
        return Cred.sshKeyFromAgent(userName)
      },
    },
  })

  // https://github.com/nodegit/nodegit/blob/master/examples/pull.js
  await repo.mergeBranches('derealize', 'origin/derealize')
}

export const gitPush = async (repo: Repository) => {
  // https://github.com/nodegit/nodegit/blob/master/examples/push.js
  const remote = await repo.getRemote('derealize')
  const pushId = await remote.push(['refs/heads/derealize:refs/heads/derealize'], {
    callbacks: {
      credentials(_url: any, userName: string) {
        return Cred.sshKeyFromAgent(userName)
      },
    },
  })
}
