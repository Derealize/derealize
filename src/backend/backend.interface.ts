import type { TailwindConfig } from 'tailwindcss/tailwind-config'

export enum Handler {
  Import = 'Import',
  Remove = 'Remove',
  Install = 'Install',
  Flush = 'Flush',
  Start = 'Start',
  Stop = 'Stop',
  Pull = 'Pull',
  Push = 'Push',
  History = 'History',
  ApplyElements = 'ApplyElements',
  InsertElement = 'InsertElement',
  DeleteElement = 'DeleteElement',
  JitTigger = 'JitTigger',
  ThemeSetImage = 'ThemeSetImage',
  ThemeRemoveImage = 'ThemeRemoveImage',
  ThemeSetColor = 'ThemeSetColor',
  ThemeRemoveColor = 'ThemeRemoveColor',
}

export enum Broadcast {
  Status = 'Status',
  Installing = 'Installing',
  Starting = 'Starting',
}

export interface ProjectConfig {
  runScript: string
  formatScript: string
  baseUrl: string
  port: number
  pages: Array<string>
  assetsPath: string
  assetsUrl: string
  applyCssFile: string
  isWeapp: boolean
}

export enum ProjectStatus {
  None = 'None',
  Initialized = 'Initialized',
  Ready = 'Ready', // npm installed
  Starting = 'Starting',
  Running = 'Running',
}

export interface PayloadError {
  projectId: string
  error: string
}

export interface Payload {
  projectId: string
  result: string
}

export interface GitFileChanges {
  file: string
  status: string
}

export interface StatusPayload {
  projectId: string
  productName: string
  changes: Array<GitFileChanges>
  status: ProjectStatus
  tailwindVersion: string
  tailwindConfig: TailwindConfig
  config: ProjectConfig
}

export interface ProcessPayload {
  projectId: string
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

export interface TailwindConfigReply {
  result?: TailwindConfig
  error?: string
}
