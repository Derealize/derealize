import Project from './project'
import message from './message'

const projects: Array<Project> = []

export const factorial = async ({ num }: Record<string, number>) => {
  function fact(n: number): number {
    if (n === 1) {
      return 1
    }
    return n * fact(n - 1)
  }

  message('making factorial')
  return fact(num)
}

export const importProject = async ({ url, path, branch, npmScript }: Record<string, string>) => {
  let project = projects.find((p) => p.url === url)
  if (!project) {
    project = new Project(url, path, branch, npmScript)
  }

  await project.ImportProject()
}

export const fileChanges = async ({ url }: Record<string, string>) => {
  const project = projects.find((p) => p.url === url)
  if (!project) {
    message('fileChanges project unexist')
    return
  }

  await project.FileChanges()
}

export const run = async ({ url }: Record<string, string>) => {
  const project = projects.find((p) => p.url === url)
  if (!project) {
    message('run project unexist')
    return
  }

  await project.Run()
}

export const push = async ({ url, msg }: Record<string, string>) => {
  const project = projects.find((p) => p.url === url)
  if (!project) {
    message('push project unexist')
    return
  }

  await project.Push(msg)
}
