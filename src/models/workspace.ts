import { Action, action, Thunk, thunk } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel } from '../interface'

declare const window: PreloadWindow
const { sendMainIpc, sendMainIpcSync } = window.derealize

const toast = createStandaloneToast({
  defaultOptions: {
    duration: 6000,
    isClosable: true,
  },
})

export interface WorkspaceModel {
  barWidth: number
  setBarWidth: Action<WorkspaceModel, number>
  loadStore: Action<WorkspaceModel>
}

const workspaceModel: WorkspaceModel = {
  barWidth: 300,
  setBarWidth: action((state, barWidth) => {
    state.barWidth = barWidth
    sendMainIpc(MainIpcChannel.SetStore, { barWidth: clone(barWidth) })
  }),

  loadStore: action((state) => {
    const barWidth = sendMainIpcSync(MainIpcChannel.GetStore, 'barWidth') as number | undefined
    if (barWidth !== undefined) {
      state.barWidth = barWidth
    }
  }),
}

export default workspaceModel
