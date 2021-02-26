import React, { useEffect } from 'react'
import {
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
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { MdHistory } from 'react-icons/md'
import { send, listen } from '../ipc'
import { CommitLog } from '../backend/project.interface'
import { Project } from '../models/project'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'

const TopBar = (): JSX.Element => {
  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const commits = useStoreState<Array<CommitLog>>((state) => state.history.commits)
  const fetchHistory = useStoreActions((actions) => actions.history.fetchHistory)

  if (!project) {
    return <div className={style.topbar} />
  }

  return (
    <Flex className={style.topbar} justify="space-between">
      <Popover>
        <PopoverTrigger>
          <MdHistory onClick={() => fetchHistory(project.url)} />
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

      <VscRepoPull />
      <VscRepoPush />
    </Flex>
  )
}

export default TopBar
