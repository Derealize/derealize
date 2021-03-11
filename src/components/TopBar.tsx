import React, { useState, useEffect, forwardRef } from 'react'
import {
  useStyleConfig,
  useToast,
  Flex,
  Box,
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
import { send, listen } from '../ipc'
import { CommitLog, ProjectStage, HistoryPayload, PayloadError } from '../backend/project.interface'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import PreloadWindow from '../preload_interface'

declare const window: PreloadWindow

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

  useEffect(() => {
    const unlisten = listen('history', (payload: HistoryPayload | PayloadError) => {
      if ((payload as PayloadError).error) {
        toast({
          title: `History error:${(payload as PayloadError).error}`,
          status: 'error',
        })
        return
      }

      if ((payload as HistoryPayload).commits) {
        setCommits((payload as HistoryPayload).commits)
      }
    })
    return unlisten
  }, [toast])

  if (!project) return <></>

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <Popover>
          <PopoverTrigger>
            <BarIconButton label="History" icon={<MdHistory />} onClick={() => send('History', { url: project.url })} />
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
          onClick={() => send('Pull', { url: project.url })}
        />

        <BarIconButton
          label="Push"
          icon={<VscRepoPush />}
          disabled={project.changes?.length === 0}
          onClick={() => send('Push', { url: project.url })}
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
              window.electron.frontProjectView(project)
              setDebugging(false)
            } else {
              window.electron.frontProjectView()
              setDebugging(true)
            }
          }}
        />

        <BarIconButton label="Project Menu" icon={<CgMenu />} onClick={() => window.electron.popupMenu(project.url)} />
      </Flex>
    </Flex>
  )
}

export default TopBar
