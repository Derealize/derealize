import Project from './project'
import log from './log'
import { HistoryReply, BoolReply } from './backend.interface'

const projectsMap = new Map<string, Project>()
type IdParam = { url: string }

const getProject = (url: string): Project => {
  const project = projectsMap.get(url)
  if (!project) throw new Error('project null')
  return project
}

export const Import = async ({ url, path, branch }: Record<string, string>): Promise<BoolReply> => {
  let project = projectsMap.get(url)
  if (!project) {
    project = new Project(url, path, branch)
    projectsMap.set(url, project)
  }

  const result = await project.Import()
  return result
}

export const Install = async ({ url }: IdParam): Promise<BoolReply> => {
  const project = getProject(url)
  const result = await project.Install()
  return result
}

export const CheckStatus = async ({ url }: IdParam) => {
  const project = getProject(url)
  await project.CheckStatus()
}

export const Start = async ({ url }: IdParam): Promise<BoolReply> => {
  const project = getProject(url)
  const result = await project.Start()
  return result
}

export const Stop = async ({ url }: IdParam) => {
  const project = getProject(url)
  await project.Stop()
}

export const Pull = async ({ url }: IdParam): Promise<BoolReply> => {
  const project = getProject(url)
  const reply = await project.Pull()
  return reply
}

export const Push = async ({ url, msg }: Record<string, string>): Promise<BoolReply> => {
  const project = getProject(url)
  const reply = await project.Push(msg)
  return reply
}

export const History = async ({ url }: IdParam): Promise<HistoryReply> => {
  const project = getProject(url)
  const logs = await project.History()
  return logs
}

// export const Dispose = async ({ url }: IdParam) => {
//   const project = getProject(url)
//   project?.Dispose()
//   projectsMap.delete(url)
// }

export const DisposeAll = async () => {
  projectsMap.forEach((p) => p.Dispose())
}

export const FocusElement = async ({ url, code }: Record<string, string>) => {
  const project = getProject(url)
  log(`${url}:${code}`)
}
