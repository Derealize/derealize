import { TailwindConfig } from 'tailwindcss/tailwind-config'
import { ProjectConfig, ProjectStage, GitFileChanges } from '../backend/backend.interface'

interface Project {
  url: string
  path: string
  editedTime: string
  name: string
  productName?: string
  isOpened?: boolean
  stage?: ProjectStage
  tailwindVersion?: string
  changes?: Array<GitFileChanges>
  installOutput?: Array<string>
  runningOutput?: Array<string>
  config?: ProjectConfig
  tailwindConfig?: TailwindConfig
}

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
}

export const OmitStoreProp = [
  'isOpened',
  'stage',
  'changes',
  'runningOutput',
  'installOutput',
  'config',
  'tailwindConfig',
]

export default Project
