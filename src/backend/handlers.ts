import Project from './project'
import log from './log'

const projectsMap = new Map<string, Project>()

export const Import = async ({ url, path, branch }: Record<string, string>) => {
  let project = projectsMap.get(url)
  if (!project) {
    project = new Project(url, path, branch)
  }

  await project.Import()
}

export const Install = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('install project unexist')
    return
  }

  await project.Install()
}

export const CheckStatus = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('checkStatus project unexist')
    return
  }

  await project.CheckStatus()
}

export const Run = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('run project unexist')
    return
  }

  await project.Run()
}

export const Push = async ({ url, msg }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('push project unexist')
    return
  }

  await project.Push(msg)
}

export const Pull = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('pull project unexist')
    return
  }

  await project.Pull()
}

export const Dispose = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('dispose project unexist')
    return
  }

  project.dispose()
  projectsMap.delete(url)
}
