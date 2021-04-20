export enum Handler {
  Import = 'Import',
  Remove = 'Remove',
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
  SelectElement = 'SelectElement',
}

export enum Broadcast {
  Status = 'Status',
  Installing = 'Installing',
  Starting = 'Starting',
  FocusElement = 'FocusElement',
  LiveUpdateClass = 'LiveUpdateClass',
  SelectElement = 'SelectElement',
}

export interface ElementPayload {
  projectId: string
  codePosition: string
  tagName: string
  className: string
  selector: string
  useShift?: boolean
  display?: string
  position?: string
  parentTagName?: string
  parentDisplay?: string
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
