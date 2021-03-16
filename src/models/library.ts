import { Action, action, Thunk, thunk } from 'easy-peasy'
import { createStandaloneToast } from '@chakra-ui/react'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { setStore, getStore } = window.derealize

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
      setStore({ librarys })
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
    setStore({ librarys: state.librarys })
  }),
  removeLibrary: action((state, libraryName) => {
    state.librarys = state.librarys.filter((p) => p.name !== libraryName)
    setStore({ librarys: state.librarys })
  }),
  loadStore: action((state) => {
    const librarys = getStore('librarys') as Array<Library> | undefined
    if (librarys) {
      state.librarys = librarys
    }
  }),
}

export default libraryModel
