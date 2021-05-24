import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import type { ProjectConfig, GitFileChanges } from '../backend/backend.interface'
import { ProjectStatus } from '../backend/backend.interface'

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
  Elements,
}

export interface Project {
  id: string
  url: string
  path: string
  editedTime: string
  name: string
  branch: string
  isOpened?: boolean
  isFront?: boolean
  isEditing?: boolean
  status?: ProjectStatus
  tailwindConfig?: TailwindConfig
  tailwindVersion?: string
  config?: ProjectConfig
  changes?: Array<GitFileChanges>
  view?: ProjectView
  startloading?: boolean
  runningOutput?: Array<string>
  jitClassName?: string
}

export interface BackgroundImage {
  name: string
  webPath: string
}
