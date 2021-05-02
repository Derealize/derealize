/* eslint-disable no-restricted-syntax */
import fs from 'fs'
import sysPath from 'path'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import Project from './project'
import log from './log'
import type { HistoryReply, BoolReply } from './backend.interface'
import type { IdParam, ImportPayload } from '../interface'
import { ElementPayload, InsertElementPayload, JitTiggerPayload } from '../interface'
import { ApplyClass, Insert, Delete, Replace, Text } from './shift'
import { npmStart } from './npm'

const projectsMap = new Map<string, Project>()

const getProject = (id: string): Project => {
  const project = projectsMap.get(id)
  if (!project) throw new Error('project null')
  return project
}

export const Import = async ({ projectId, url, path, branch }: ImportPayload): Promise<BoolReply> => {
  let project = projectsMap.get(projectId)
  if (!project) {
    project = new Project(projectId, url, path, branch)
    projectsMap.set(projectId, project)
  }

  const result = await project.Import()
  return result
}

export const Remove = async ({ projectId }: IdParam): Promise<BoolReply> => {
  const result = projectsMap.delete(projectId)
  return { result }
}

export const Install = async ({ projectId }: IdParam): Promise<BoolReply> => {
  const project = getProject(projectId)
  const result = project.Install()
  return result
}

export const CheckStatus = async ({ projectId }: IdParam) => {
  const project = getProject(projectId)
  await project.CheckStatus()
}

export const Start = async ({ projectId }: IdParam): Promise<BoolReply> => {
  const project = getProject(projectId)
  const result = await project.Start()
  return result
}

export const Stop = async ({ projectId }: IdParam) => {
  const project = getProject(projectId)
  await project.Stop()
}

export const Pull = async ({ projectId }: IdParam): Promise<BoolReply> => {
  const project = getProject(projectId)
  const reply = await project.Pull()
  return reply
}

export const Push = async ({ projectId, msg }: IdParam & { msg: string }): Promise<BoolReply> => {
  const project = getProject(projectId)
  const reply = await project.Push(msg)
  return reply
}

export const History = async ({ projectId }: IdParam): Promise<HistoryReply> => {
  const project = getProject(projectId)
  const logs = await project.History()
  return logs
}

// export const Dispose = async ({ projectId }: IdParam) => {
//   const project = getProject(projectId)
//   project?.Dispose()
//   projectsMap.delete(projectId)
// }

export const DisposeAll = async () => {
  // https://eslint.org/docs/rules/no-await-in-loop#examples
  const promises = []
  for (const project of projectsMap.values()) {
    promises.push(project.Dispose())
  }
  await Promise.all(promises)
  log('DisposeAll')
}

export const GetTailwindConfig = async ({ projectId }: IdParam): Promise<TailwindConfig> => {
  const project = getProject(projectId)
  const config = await project.GetTailwindConfig()
  return config
}

export const ApplyElementsClassName = async (payloads: Array<ElementPayload>) => {
  if (!payloads.length) return
  const project = getProject(payloads[0].projectId)
  ApplyClass(project.path, payloads)
}

export const InsertElement = async (payload: InsertElementPayload) => {
  const project = getProject(payload.projectId)

  Insert(project.path, payload)
  npmStart(project.path, project.config.formatScript)
}

export const DeleteElement = async (payload: ElementPayload) => {
  const project = getProject(payload.projectId)

  Delete(project.path, payload)
  npmStart(project.path, project.config.formatScript)
}

export const ReplaceElement = async (payload: InsertElementPayload) => {
  const project = getProject(payload.projectId)

  Replace(project.path, payload)
}

export const TextElement = async (payload: ElementPayload) => {
  const project = getProject(payload.projectId)

  Text(project.path, payload)
}

export const JitTigger = (payload: JitTiggerPayload) => {
  const project = getProject(payload.projectId)

  const filePath = sysPath.resolve(project.path, 'derealize-jit.html')
  fs.writeFileSync(filePath, `<a class="${payload.className}"></a>`, { encoding: 'utf8' })
}
