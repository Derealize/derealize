import type { TailwindConfig, TailwindColorConfig, TailwindColorGroup } from 'tailwindcss/tailwind-config'
import type { ProjectConfig, ProjectConfigStd, GitFileChanges } from '../backend/backend.interface'
import { ProjectStatus } from '../backend/backend.interface'

export enum ProjectView {
  BrowserView,
  Loading,
  LoadFail,
}

export enum ProjectViewStd {
  BrowserView,
  Loading,
  LoadFail,
  Debugging,
  FileStatus,
}

export interface Project {
  id: string
  path: string
  editedTime: string
  name: string
  isOpened?: boolean
  isFront?: boolean
  isEditing?: boolean
  tailwindConfig?: TailwindConfig
  tailwindVersion?: string
  config?: ProjectConfig
  view?: ProjectView
  viewHistory?: boolean
  jitClassName?: string
  favicon?: string
}

export interface ProjectStd extends Omit<Project, 'view'> {
  url?: string
  branch?: string
  status?: ProjectStatus
  config?: ProjectConfigStd
  view?: ProjectViewStd
  changes?: Array<GitFileChanges>
  startloading?: boolean
  runningOutput?: Array<string>
}

export interface BackgroundImage {
  name: string
  webPath: string
}

export interface Colors extends TailwindColorConfig {
  // DEFAULT: string
  [key: string]: string | TailwindColorGroup
}
