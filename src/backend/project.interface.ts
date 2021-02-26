export interface ProjectConfig {
  branch: string
  npmScript: string
  lunchUrl: string
  page: Array<string>
  assets: string
  applyCssFile: string
}

export enum ProjectStage {
  None,
  Initialized,
  Ready, // npm standby
  Running,
}

export interface Payload {
  id: string
  result?: string
  error?: string
}

export interface GitFileChanges {
  file: string
  status: string
}

export interface StatusPayload {
  id: string
  productName?: string
  changes?: Array<GitFileChanges>
  stage?: ProjectStage
  tailwindVersion?: string
  config?: ProjectConfig
  error?: string
}

export interface ProcessPayload {
  id: string
  reset?: boolean
  stdout?: string
  stderr?: string
  error?: string
  exit?: number
}

export interface CommitLog {
  sha: string
  author: string
  date: Date
  message: string
}

export interface HistoryPayload {
  id: string
  commits?: Array<CommitLog>
  error?: string
}
