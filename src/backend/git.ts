import log from 'electron-log'
import Git from 'nodegit'
import broadcast from './broadcast'

export const Clone = async (url: string, path: string) => {
  try {
    const repository = await Git.Clone.clone(url, path)
    const commit = await repository.getHeadCommit()
    broadcast('git_clone', { result: commit.id().tostrS() })
  } catch (err) {
    if (err.message === 'exist') {
      // todo condition
      // https://github.com/nodegit/nodegit/blob/master/guides/cloning/index.js
      const repository = await Git.Repository.open(path)
      const commit = await repository.getHeadCommit()
      broadcast('git_clone', { result: commit.id().tostrS() })
    } else {
      log.error(err)
      broadcast('git_clone', { error: err.message })
    }
  }
}

// https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
export const Commit = async (path: string) => {
  try {
    const repo = await Git.Repository.open(path)
    const index = await repo.refreshIndex()
    await index.addByPath('.')
    await index.write()
    const tree = await index.writeTree()
    const head = await Git.Reference.nameToId(repo, 'HEAD')
    const commit = await repo.getCommit(head)
    const committer = Git.Signature.default(repo)
    const commitId = await repo.createCommit('HEAD', committer, committer, 'message', tree, [commit])
    broadcast('git_commit', { result: commitId.tostrS() })
  } catch (err) {
    log.error(err)
    broadcast('git_commit', { error: err.message })
  }
}
