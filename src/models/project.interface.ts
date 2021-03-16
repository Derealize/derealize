import { ProjectConfig, ProjectStage, GitFileChanges } from '../backend/project.interface'

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
  runningOutput?: Array<string>
  config?: ProjectConfig
}

export enum ProjectView {
  Debugging,
  FileStatus,
  BrowserView,
}

export default Project
