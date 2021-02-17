export interface ProjectConfig {
  name: string
  branch: string
  npmScript: string
  port: number
  assets: string
}

export enum ProjectStage {
  None,
  Initialized,
  Ready,
  Running,
}

export interface GitFileChanges {
  file: string
  status: string
}

export interface Payload {
  result?: string
  error?: string
}

export interface StatusPayload {
  id: string
  changes?: Array<GitFileChanges>
  stage?: ProjectStage
  tailwindVersion?: string
  error?: string
}

export interface ProcessPayload {
  stdout?: string
  stderr?: string
  error?: string
  exited?: number
}
