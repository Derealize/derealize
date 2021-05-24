import omit from 'lodash.omit'
import clone from 'lodash.clonedeep'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel } from '../interface'
import type { Project } from '../models/project.interface'

declare const window: PreloadWindow

const { sendMainIpc } = window.derealize

// export type Element = Omit<ElementPayload, 'projectId'>

export const OmitStoreProp = [
  'isOpened',
  'isFront',
  'isEditing',
  'status',
  'stage',
  'changes',
  'runningOutput',
  'installOutput',
  'config',
  'tailwindConfig',
  'elements',
  'view',
  'startloading',
  'jitClassName',
]

const storeProject = (projects: Array<Project>) => {
  // proxy object can't serialize https://stackoverflow.com/a/60344844
  const omitProjects = projects.map((p) => omit(p, OmitStoreProp))
  sendMainIpc(MainIpcChannel.SetStore, { projects: clone(omitProjects) })
}

export default storeProject
