export interface ProjectConfig {
  branch: string
  npmScript: string
  lunchUrl: string
  pages: Array<string>
  assets: string
  applyCssFile: string
}

export enum ProjectStage {
  None,
  Initialized,
  Ready, // npm installed
  Starting,
  Running,
}

export interface PayloadError {
  id: string
  error: string
}

export interface Payload {
  id: string
  result: string
}

export interface GitFileChanges {
  file: string
  status: string
}

export interface StatusPayload {
  id: string
  productName: string
  changes: Array<GitFileChanges>
  stage: ProjectStage
  tailwindVersion: string
  config: ProjectConfig
}

export interface ProcessPayload {
  id: string
  reset?: boolean
  stdout?: string
  stderr?: string
  exit?: number
  error: string
}

export interface CommitLog {
  sha: string
  author: string
  date: Date
  message: string
}

export interface HistoryPayload {
  id: string
  commits: Array<CommitLog>
}
