import React, { useEffect } from 'react'
import cs from 'classnames'
import { Text, IconButton, List, ListItem, ListIcon, Table, Tbody, Tr, Td, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import Project from './models/project.interface'
import { CommitLog } from './backend/project.interface'
import TopBar from './components/TopBar'
import style from './Project.module.scss'

const ProjectView = (): JSX.Element => {
  const loading = useStoreState<boolean>((state) => state.project.loading)
  const project = useStoreState<Project | null>((state) => state.project.frontProject)

  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const setDebugging = useStoreActions((actions) => actions.project.setDebugging)

  const openStatus = useStoreState<boolean>((state) => state.project.openStatus)
  const setOpenStatus = useStoreActions((actions) => actions.project.setOpenStatus)

  const historys = useStoreState<Array<CommitLog>>((state) => state.project.historys)

  return (
    <>
      <TopBar />
      <div className={style.content}>
        <PuffLoader loading={loading} color="#4FD1C5" />
        {project && debugging && (
          <>
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
            <CloseButton
              size="lg"
              colorScheme="gray"
              onClick={() => {
                setDebugging(false)
              }}
            />
          </>
        )}

        {project && openStatus && (
          <>
            {!!project.changes?.length && <Text>There are {project.changes.length} files to be pushed</Text>}
            <List spacing={3}>
              {historys.map((h) => {
                const isDerealize = h.message.includes('derealize')
                return (
                  <ListItem key={h.sha}>
                    <ListIcon
                      as={isDerealize ? VscRepoPush : VscRepoPull}
                      color={isDerealize ? 'teal.400' : 'gray.400'}
                    />
                    <Table variant="simple" size="sm">
                      <Tbody>
                        <Tr>
                          <Td>{h.date}</Td>
                          <Td>{h.author}</Td>
                          <Td>{h.message}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </ListItem>
                )
              })}
            </List>
            <CloseButton
              size="lg"
              colorScheme="gray"
              onClick={() => {
                setOpenStatus(false)
              }}
            />
          </>
        )}
      </div>
    </>
  )
}

export default ProjectView
