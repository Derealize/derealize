import Project from './project'
import log from './log'

const projectsMap = new Map<string, Project>()

const getProject = (url: string): Project | undefined => {
  const project = projectsMap.get(url)
  if (!project) {
    log('project unexist')
    return undefined
  }
  return project
}

export const Import = async ({ url, path, branch }: Record<string, string>) => {
  let project = projectsMap.get(url)
  if (!project) {
    project = new Project(url, path, branch)
  }

  await project.Import()
}

export const Install = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Install()
}

export const Status = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Status()
}

export const Start = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Start()
}

export const Stop = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Stop()
}

export const Push = async ({ url, msg }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Push(msg)
}

export const Pull = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.Pull()
}

export const History = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  await project?.History()
}

export const Dispose = async ({ url }: Record<string, string>) => {
  const project = getProject(url)
  project?.Dispose()
  projectsMap.delete(url)
}
