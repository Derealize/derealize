import React, { useState, useEffect, useCallback } from 'react'
import { useStyleConfig, useToast, Flex, IconButton, RefAttributes } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { VscRepoPush, VscRepoPull, VscOutput } from 'react-icons/vsc'
import { CgPlayButtonR, CgPlayStopR, CgSelectR, CgMenu } from 'react-icons/cg'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { BiRectangle } from 'react-icons/bi'
import { RiInputMethodLine } from 'react-icons/ri'
import { AiOutlineBorderHorizontal, AiOutlineBorder } from 'react-icons/ai'
import { FiLink2 } from 'react-icons/fi'
import { ProjectStage, BoolReply } from '../backend/project.interface'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { send, popupMenu } = window.derealize

const BarIconButton = React.forwardRef(
  (
    props: { label: string; selected: boolean } & RefAttributes<HTMLButtonElement>,
    ref: React.LegacyRef<HTMLButtonElement> | undefined,
  ) => {
    const { label, selected, ...rest } = props
    const styles = useStyleConfig('BarIconButton')

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <IconButton ref={ref} aria-label={label} sx={styles} bg={selected ? 'gray.200' : 'transparent'} {...rest} />
  },
)

type Props = {
  project: Project
}

const TopBar: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const toast = useToast()

  const startProject = useStoreActions((actions) => actions.project.startProject)
  const stopProject = useStoreActions((actions) => actions.project.stopProject)

  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const setDebugging = useStoreActions((actions) => actions.project.setDebugging)

  const openStatus = useStoreState<boolean>((state) => state.project.openStatus)
  const setOpenStatus = useStoreActions((actions) => actions.project.setOpenStatus)

  const callHistory = useStoreActions((actions) => actions.project.callHistory)

  const callPull = useCallback(async () => {
    if (!project) return null

    const reply = (await send('Pull', { url: project.url })) as BoolReply
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

    const reply = (await send('Push', { url: project.url })) as BoolReply
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
        <BarIconButton
          label="History"
          selected={openStatus}
          icon={<HiOutlineStatusOnline />}
          onClick={() => {
            if (openStatus) {
              setOpenStatus(false)
            } else {
              setOpenStatus(true)
              callHistory()
            }
          }}
        />

        <BarIconButton
          label="Pull"
          icon={<VscRepoPull />}
          disabled={project.changes?.length !== 0}
          onClick={() => callPull()}
        />

        <BarIconButton
          label="Push"
          icon={<VscRepoPush />}
          disabled={project.changes?.length === 0}
          onClick={() => callPush()}
        />
      </Flex>

      <Flex align="center" justify="center">
        <BarIconButton label="Cursor" icon={<HiCursorClick />} />
        <BarIconButton label="Rect" icon={<BiRectangle />} />
        <BarIconButton label="Link" icon={<FiLink2 />} />
        <BarIconButton label="Text" icon={<RiInputMethodLine />} />
        <BarIconButton label="Input" icon={<AiOutlineBorderHorizontal />} />
        <BarIconButton label="Select" icon={<CgSelectR />} />
      </Flex>

      <Flex align="center" justify="right">
        {project.stage === ProjectStage.Ready && (
          <BarIconButton label="Start" icon={<CgPlayButtonR />} onClick={() => startProject(project.url)} />
        )}
        {(project.stage === ProjectStage.Running || project.stage === ProjectStage.Starting) && (
          <BarIconButton label="Stop" icon={<CgPlayStopR />} onClick={() => stopProject(project.url)} />
        )}

        <BarIconButton
          label="Debug"
          selected={debugging}
          icon={<VscOutput />}
          onClick={() => {
            setDebugging(!debugging)
          }}
        />

        <BarIconButton label="Project Menu" icon={<CgMenu />} onClick={() => popupMenu(project.url)} />
      </Flex>
    </Flex>
  )
}

export default TopBar
