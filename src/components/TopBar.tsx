import React, { useState, useEffect } from 'react'
import {
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuIcon,
  MenuCommand,
  MenuDivider,
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
import { Project } from '../models/project'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'

const TopBar = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const startProject = useStoreActions((actions) => actions.project.startProject)
  const stopProject = useStoreActions((actions) => actions.project.stopProject)

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
            <IconButton
              variant="unstyled"
              aria-label="History"
              icon={<MdHistory />}
              onClick={() => send('History', { url: project.url })}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>History</PopoverHeader>
            <PopoverBody>
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
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <IconButton
          variant="unstyled"
          disabled={project.changes?.length !== 0}
          aria-label="Pull"
          icon={<VscRepoPull />}
          onClick={() => send('Pull', { url: project.url })}
        />
        <IconButton
          variant="unstyled"
          disabled={project.changes?.length === 0}
          aria-label="Push"
          icon={<VscRepoPush />}
          onClick={() => send('Push', { url: project.url })}
        />
      </Flex>

      <Flex align="center" justify="center">
        <HiCursorClick />
        <BiRectangle />
        <FiLink2 />
        <RiInputMethodLine />
        <AiOutlineBorderHorizontal />
        <AiOutlineBorder />
        <CgSelectR />
      </Flex>

      <Flex align="center" justify="right">
        {project.stage === ProjectStage.Ready && (
          <IconButton
            variant="unstyled"
            aria-label="Start Project"
            icon={<CgPlayButtonR />}
            onClick={() => startProject(project.url)}
          />
        )}
        {project.stage === ProjectStage.Running ||
          (project.stage === ProjectStage.Starting && (
            <IconButton
              variant="unstyled"
              aria-label="Stop Project"
              icon={<CgPlayStopR />}
              onClick={() => stopProject(project.url)}
            />
          ))}

        <Popover>
          <PopoverTrigger>
            <IconButton aria-label="Output" icon={<VscOutput />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{project.stage && ProjectStage[project.stage]}</PopoverHeader>
            <PopoverBody>
              <div className={style.output}>
                {project.runningOutput?.map((o, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Text color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'} key={i}>
                    {o}
                  </Text>
                ))}
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Menu>
          <MenuButton as={IconButton} aria-label="Menu" icon={<CgMenu />} variant="outline" />
          <MenuList>
            <MenuItem>Refresh</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default TopBar
