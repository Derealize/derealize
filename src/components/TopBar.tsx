import React, { useState, useEffect, forwardRef, useCallback } from 'react'
import {
  useStyleConfig,
  useToast,
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
} from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { VscRepoPush, VscRepoPull, VscOutput } from 'react-icons/vsc'
import { MdHistory } from 'react-icons/md'
import { CgPlayButtonR, CgPlayStopR, CgSelectR, CgMenu } from 'react-icons/cg'
import { HiCursorClick } from 'react-icons/hi'
import { BiRectangle } from 'react-icons/bi'
import { RiInputMethodLine } from 'react-icons/ri'
import { AiOutlineBorderHorizontal, AiOutlineBorder } from 'react-icons/ai'
import { FiLink2 } from 'react-icons/fi'
import { CommitLog, ProjectStage, BoolReply, HistoryReply } from '../backend/project.interface'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { listen, send, frontProjectView, popupMenu } = window.derealize

const BarIconButton = React.forwardRef((props: any, ref) => {
  const { label, ...rest } = props

  const styles = useStyleConfig('BarIconButton')

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton ref={ref} aria-label={label} sx={styles} {...rest} />
})

const TopBar = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const startProject = useStoreActions((actions) => actions.project.startProject)
  const stopProject = useStoreActions((actions) => actions.project.stopProject)

  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const setDebugging = useStoreActions((actions) => actions.project.setDebugging)

  const [commits, setCommits] = useState<Array<CommitLog>>([])

  const callHistory = useCallback(async () => {
    if (!project) return null

    const reply = (await send('History', { url: project.url })) as HistoryReply
    if (reply.error) {
      toast({
        title: `History error:${reply.error}`,
        status: 'error',
      })
    } else {
      setCommits(reply.result)
    }
    return null
  }, [project, toast])

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

  if (!project) return <></>

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <Popover>
          <PopoverTrigger>
            <BarIconButton label="History" icon={<MdHistory />} onClick={() => callHistory()} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>History</PopoverHeader>
            <PopoverBody>
              <>
                {project.changes?.length && <Text>There are {project.changes.length} files to be pushed</Text>}
                <List spacing={3}>
                  {commits.map((commit) => {
                    const isDerealize = commit.message.includes('derealize')
                    return (
                      <ListItem key={commit.sha}>
                        <ListIcon
                          as={isDerealize ? VscRepoPush : VscRepoPull}
                          color={isDerealize ? 'teal.400' : 'gray.400'}
                        />
                        <Table variant="simple" size="sm">
                          <Tbody>
                            <Tr>
                              <Td>{commit.date}</Td>
                              <Td>{commit.author}</Td>
                              <Td>{commit.message}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </ListItem>
                    )
                  })}
                </List>
              </>
            </PopoverBody>
          </PopoverContent>
        </Popover>

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
          colorScheme={debugging ? 'teal' : 'gray'}
          icon={<VscOutput />}
          onClick={() => {
            if (debugging) {
              frontProjectView(project)
              setDebugging(false)
            } else {
              frontProjectView()
              setDebugging(true)
            }
          }}
        />

        <BarIconButton label="Project Menu" icon={<CgMenu />} onClick={() => popupMenu(project.url)} />
      </Flex>
    </Flex>
  )
}

export default TopBar
