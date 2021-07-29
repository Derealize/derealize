/* eslint-disable no-restricted-syntax */
import fs from 'fs/promises'
import sysPath from 'path'
import log, { captureException } from './log'
import Project from './project'
import type { BoolReply, TailwindConfigReply } from './backend.interface'
import type { ProjectIdParam, ImportPayload } from '../interface'
import {
  ElementPayload,
  InsertElementPayload,
  JitTiggerPayload,
  ThemeSetImagePayload,
  ThemeRemoveImagePayload,
  ThemeColorPayload,
} from '../interface'
import { Apply, Insert, Delete } from './shift/react'
import { SetImage, RemoveImage } from './shift/image'
import { SetColor, RemoveColor } from './shift/colors'
import { npmStart } from './npm'

const projectsMap = new Map<string, Project>()

const getProject = (id: string): Project => {
  const project = projectsMap.get(id)
  if (!project) throw new Error('project null')
  return project
}

export const Import = async ({ projectId, path }: ImportPayload): Promise<BoolReply> => {
  let project = projectsMap.get(projectId)
  if (!project) {
    project = new Project(projectId, path)
    projectsMap.set(projectId, project)
  }

  const result = await project.Flush()
  return result
}

export const Remove = async ({ projectId }: ProjectIdParam): Promise<BoolReply> => {
  const result = projectsMap.delete(projectId)
  return { result }
}

export const Flush = async ({ projectId }: ProjectIdParam) => {
  const project = getProject(projectId)
  await project.Flush()
}

export const DisposeAll = async () => {
  log('mock DisposeAll')
}

export const ApplyElements = async (payloads: Array<ElementPayload>) => {
  if (!payloads.length) return
  const project = getProject(payloads[0].projectId)
  Apply(project.path, payloads)
}

export const InsertElement = async (payload: InsertElementPayload) => {
  const project = getProject(payload.projectId)

  await Insert(project.path, payload)
  npmStart(project.path, project.config.formatScript)
}

export const DeleteElement = async (payload: ElementPayload) => {
  const project = getProject(payload.projectId)

  await Delete(project.path, payload)
  npmStart(project.path, project.config.formatScript)
}

export const JitTigger = async ({ projectId, className }: JitTiggerPayload) => {
  const project = getProject(projectId)

  const filePath = sysPath.resolve(project.path, 'derealize-jit.html')
  fs.writeFile(filePath, `<a class="${className}"></a>`, { encoding: 'utf8' })
}

export const ThemeSetImage = async ({
  projectId,
  key,
  path,
  fileName,
}: ThemeSetImagePayload): Promise<TailwindConfigReply> => {
  const project = getProject(projectId)

  const { assetsPath, assetsUrl } = project.config
  const filePath = sysPath.resolve(project.path, assetsPath, fileName)

  try {
    fs.copyFile(path, filePath)
  } catch (err) {
    captureException(err)
  }

  const cssUrl = `url(${sysPath.posix.join(assetsUrl, fileName)})`
  const { result, error } = await SetImage(project.path, key, cssUrl)
  project.ResolveTailwindConfig()
  return result ? { result: project.tailwindConfig } : { error }
}

export const ThemeRemoveImage = async ({
  projectId,
  key,
  webPath,
}: ThemeRemoveImagePayload): Promise<TailwindConfigReply> => {
  const project = getProject(projectId)

  const { assetsPath } = project.config
  const filePath = sysPath.resolve(project.path, assetsPath, sysPath.basename(webPath))

  try {
    fs.unlink(filePath)
  } catch (err) {
    captureException(err)
  }

  const { result, error } = await RemoveImage(project.path, key)
  if (result) {
    project.ResolveTailwindConfig()
    return { result: project.tailwindConfig }
  }

  return { error }
}

export const ThemeSetColor = async ({
  projectId,
  theme,
  key,
  value,
}: ThemeColorPayload): Promise<TailwindConfigReply> => {
  const project = getProject(projectId)

  const { result, error } = await SetColor(project.path, theme, key, value)

  if (result) {
    project.ResolveTailwindConfig()
    return { result: project.tailwindConfig }
  }
  return { error }
}

export const ThemeRemoveColor = async ({ projectId, theme, key }: ThemeColorPayload): Promise<TailwindConfigReply> => {
  const project = getProject(projectId)

  const { result, error } = await RemoveColor(project.path, theme, key)

  if (result) {
    project.ResolveTailwindConfig()
    return { result: project.tailwindConfig }
  }
  return { error }
}
