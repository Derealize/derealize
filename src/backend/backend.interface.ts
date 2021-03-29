export enum Handler {
  Import = 'Import',
  Install = 'Install',
  CheckStatus = 'CheckStatus',
  Start = 'Start',
  Stop = 'Stop',
  Pull = 'Pull',
  Push = 'Push',
  History = 'History',
  GetTailwindConfig = 'GetTailwindConfig',
  FocusElement = 'FocusElement',
  UpdateClass = 'UpdateClass',
}

export enum Broadcast {
  Status = 'Status',
  Installing = 'Installing',
  Starting = 'Starting',
  FocusElement = 'FocusElement',
  LiveUpdateClass = 'LiveUpdateClass',
}

export interface ProjectConfig {
  branch: string
  npmScript: string
  lunchUrl: string
  port: number
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
  tailwindConfigPath: string
  config: ProjectConfig
}

export interface ProcessPayload {
  id: string
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

export interface HistoryReply {
  result: Array<CommitLog>
  error?: string
}

export interface BoolReply {
  result: boolean
  error?: string
}
