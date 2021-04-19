import React, { useState, useEffect, useCallback } from 'react'
import { useStyleConfig, useToast, Flex, IconButton, Tooltip, IconButtonProps } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { VscRepoPush, VscRepoPull, VscOutput, VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { CgSelectR, CgMenu } from 'react-icons/cg'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { BiRectangle, BiDevices } from 'react-icons/bi'
import { IoBookmarksOutline } from 'react-icons/io5'
import type { BoolReply } from '../backend/backend.interface'
import { ProjectStage, Handler, ElementPayload } from '../backend/backend.interface'
import { Project, ProjectView } from '../models/project'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import Breadcrumb from './Breadcrumb'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { send, projectMenu, pagesMenu } = window.derealize

const BarIconButton = React.forwardRef(
  (props: { selected?: boolean } & IconButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
    const { selected, ...rest } = props
    const styles = useStyleConfig('BarIconButton')

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <IconButton ref={ref} sx={styles} bg={selected ? 'gray.200' : 'transparent'} {...rest} />
  },
)
BarIconButton.defaultProps = {
  selected: false,
}

type Props = {
  project: Project
}

const TopBar: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const toast = useToast()

  const startProject = useStoreActions((actions) => actions.project.startProject)
  const stopProject = useStoreActions((actions) => actions.project.stopProject)

  const frontProjectView = useStoreState<ProjectView>((state) => state.project.frontProjectView)
  const setFrontProjectView = useStoreActions((actions) => actions.project.setFrontProjectView)

  const callHistory = useStoreActions((actions) => actions.project.callHistory)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const callPull = useCallback(async () => {
    if (!project) return null

    const reply = (await send(Handler.Pull, { url: project.url })) as BoolReply
    if (reply.error) {
      toast({
        title: `Pull error:${reply.error}`,
        status: 'error',
      })
    } else {
      toast({
        title: `Pull: ${reply.result}`,
        status: 'success',
      })
    }
    return null
  }, [project, toast])

  const callPush = useCallback(async () => {
    if (!project) return null

    const reply = (await send(Handler.Push, { url: project.url })) as BoolReply
    if (reply.error) {
      toast({
        title: `Push error:${reply.error}`,
        status: 'error',
      })
    } else {
      toast({
        title: `Push: ${reply.result}`,
        status: 'success',
      })
    }
    return null
  }, [project, toast])

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <Tooltip label="files status and history">
          <BarIconButton
            aria-label="FileStatus"
            selected={frontProjectView === ProjectView.FileStatus}
            icon={<HiOutlineStatusOnline />}
            onClick={() => {
              if (frontProjectView !== ProjectView.FileStatus) {
                callHistory()
                setFrontProjectView(ProjectView.FileStatus)
              } else {
                setFrontProjectView(ProjectView.BrowserView)
              }
            }}
          />
        </Tooltip>

        <Tooltip label="pull remote files">
          <BarIconButton
            aria-label="Pull"
            icon={<VscRepoPull />}
            disabled={project.changes?.length !== 0}
            onClick={() => callPull()}
          />
        </Tooltip>

        <Tooltip label="push files to remote">
          <BarIconButton
            aria-label="Push"
            icon={<VscRepoPush />}
            disabled={project.changes?.length === 0}
            onClick={() => callPush()}
          />
        </Tooltip>

        <BarIconButton aria-label="Pages" icon={<IoBookmarksOutline />} onClick={() => pagesMenu()} />
      </Flex>

      <Breadcrumb project={project} />

      <Flex align="center" justify="right">
        <BarIconButton aria-label="Disable Cursor" icon={<HiCursorClick />} />
        {project.stage === ProjectStage.Ready && (
          <Tooltip label="start">
            <BarIconButton aria-label="Start" icon={<VscDebugStop />} onClick={() => startProject(project.url)} />
          </Tooltip>
        )}
        {(project.stage === ProjectStage.Running || project.stage === ProjectStage.Starting) && (
          <Tooltip label="stop">
            <BarIconButton aria-label="Stop" icon={<VscDebugStart />} onClick={() => stopProject(project.url)} />
          </Tooltip>
        )}
        {/* https://discuss.atom.io/t/emulate-touch-scroll/27429/3 */}
        <BarIconButton aria-label="Mobile Device" icon={<BiDevices />} />
        <Tooltip label="debug information">
          <BarIconButton
            aria-label="Debug"
            selected={frontProjectView === ProjectView.Debugging}
            icon={<VscOutput />}
            onClick={() => {
              if (frontProjectView !== ProjectView.Debugging) {
                setFrontProjectView(ProjectView.Debugging)
              } else {
                setFrontProjectView(ProjectView.BrowserView)
              }
            }}
          />
        </Tooltip>
        <BarIconButton aria-label="Project Menu" icon={<CgMenu />} onClick={() => projectMenu()} />
      </Flex>
    </Flex>
  )
}

export default TopBar
