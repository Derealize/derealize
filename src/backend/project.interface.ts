export interface ProjectConfig {
  name: string
  branch: string
  npmScript: string
  port: number
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
  changes?: Array<GitFileChanges>
  stage?: ProjectStage
  tailwindVersion?: string
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
