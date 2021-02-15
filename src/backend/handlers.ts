import Project from './project'
import log from './log'

const projectsMap = new Map<string, Project>()

export const Import = async ({ url, path }: Record<string, string>) => {
  let project = projectsMap.get(url)
  if (!project) {
    project = new Project(url, path)
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

export const FileStatus = async ({ url }: Record<string, string>) => {
  const project = projectsMap.get(url)
  if (!project) {
    log('fileChanges project unexist')
    return
  }

  await project.FileStatus()
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

export const pull = async ({ url }: Record<string, string>) => {
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
