import React, { useEffect } from 'react'
import cs from 'classnames'
import dayjs from 'dayjs'
import { Text, IconButton, List, ListItem, ListIcon, Table, Tbody, Tr, Td, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import Project from './models/project.interface'
import { CommitLog } from './backend/project.interface'
import TopBar from './components/TopBar'
import style from './Project.module.scss'

type Props = {
  project: Project
}

const ProjectView: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const loading = useStoreState<boolean>((state) => state.project.loading)

  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const setDebugging = useStoreActions((actions) => actions.project.setDebugging)

  const openStatus = useStoreState<boolean>((state) => state.project.openStatus)
  const setOpenStatus = useStoreActions((actions) => actions.project.setOpenStatus)

  const historys = useStoreState<Array<CommitLog>>((state) => state.project.historys)

  return (
    <>
      <TopBar project={project} />
      <div className={style.content}>
        <PuffLoader loading={loading} color="#4FD1C5" />
        {debugging && (
          <>
            <CloseButton
              size="lg"
              colorScheme="gray"
              onClick={() => {
                setDebugging(false)
              }}
            />
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
          </>
        )}

        {!debugging && openStatus && (
          <>
            <CloseButton
              size="lg"
              colorScheme="gray"
              onClick={() => {
                setOpenStatus(false)
              }}
            />
            {!!project.changes?.length && <Text>There are {project.changes.length} files to be pushed</Text>}
            <List spacing={2}>
              {historys.map((h) => {
                const isDerealize = h.message.includes('derealize')
                return (
                  <ListItem key={h.sha} className={style.listitem}>
                    <ListIcon
                      as={isDerealize ? VscRepoPush : VscRepoPull}
                      color={isDerealize ? 'teal.400' : 'gray.400'}
                    />
                    <span className={style.data}>{dayjs(h.date).format('YYYY-M-D H:m:s')}</span>
                    <span className={style.author}>{h.author}</span>
                    <span className={style.message}>{h.message}</span>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}
      </div>
    </>
  )
}

export default ProjectView
