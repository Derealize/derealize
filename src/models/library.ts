import { Action, action, Thunk, thunk } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
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

export interface Library {
  name: string
  username: string
  password: string
}

export interface LibraryModel {
  librarys: Array<Library>
  setLibrarys: Action<LibraryModel, { librarys: Array<Library>; storage?: boolean }>
  addLibrary: Action<LibraryModel, Library>
  removeLibrary: Action<LibraryModel, string>
  loadStore: Action<LibraryModel>
}

const libraryModel: LibraryModel = {
  librarys: [],
  setLibrarys: action((state, { librarys, storage }) => {
    state.librarys = librarys
    if (storage) {
      // todo: RxDB store
      sendMainIpc(MainIpcChannel.SetStore, { librarys })
    }
  }),
  addLibrary: action((state, library) => {
    if (state.librarys.map((l) => l.name).includes(library.name)) {
      toast({
        title: 'Library name already exists',
        status: 'warning',
      })
      return
    }
    state.librarys.push(library)
    sendMainIpc(MainIpcChannel.SetStore, { librarys: state.librarys })
  }),
  removeLibrary: action((state, libraryName) => {
    state.librarys = state.librarys.filter((p) => p.name !== libraryName)
    sendMainIpc(MainIpcChannel.SetStore, { librarys: state.librarys })
  }),
  loadStore: action((state) => {
    const librarys = sendMainIpcSync(MainIpcChannel.GetStore, 'librarys') as Array<Library> | undefined
    if (librarys) {
      state.librarys = librarys
    }
  }),
}

export default libraryModel
