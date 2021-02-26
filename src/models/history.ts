import { Action, action, Thunk, thunk } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import { CommitLog, HistoryPayload } from '../backend/project.interface'
import { send, listen } from '../ipc'

let unlisten: any

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

export interface HistoryModel {
  commits: Array<CommitLog>
  setCommits: Action<HistoryModel, Array<CommitLog>>

  fetchHistory: Action<HistoryModel, string>
  listen: Thunk<HistoryModel>
  unlisten: Action<HistoryModel>
}

const historyModel: HistoryModel = {
  commits: [],
  setCommits: action((state, commits) => {
    state.commits = commits
  }),

  fetchHistory: action((state, url) => {
    send('History', { url })
  }),

  listen: thunk(async (actions) => {
    actions.unlisten()
    unlisten = listen('history', (payload: HistoryPayload) => {
      if (payload.error) {
        toast({
          title: `History error:${payload.error}`,
          status: 'error',
        })
        return
      }

      if (payload.commits) {
        actions.setCommits(payload.commits)
      }
    })
  }),

  unlisten: action((state) => {
    if (unlisten) unlisten()
  }),
}

export default historyModel
