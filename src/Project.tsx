import React, { useCallback, useMemo, useReducer } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import dayjs from 'dayjs'
import { Text, Button, List, ListItem, ListIcon, useToast, Box, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project, ProjectView } from './models/project'
import type { CommitLog, BoolReply, ElementPayload } from './backend/backend.interface'
import { Handler } from './backend/backend.interface'
import TopBar from './components/TopBar'
import Controllers from './components/controllers/Controllers'
import style from './Project.module.scss'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { send } = window.derealize

type Props = {
  project: Project
}

const ProjectPage: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const toast = useToast()
  const loading = useStoreState<boolean>((state) => state.project.startloading)

  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)
  const frontProjectView = useStoreState<ProjectView>((state) => state.project.frontProjectView)
  const setFrontProjectView = useStoreActions((actions) => actions.project.setFrontProjectView)

  const historys = useStoreState<Array<CommitLog>>((state) => state.project.historys)
  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

  const runningOutput = useStoreState<Array<string>>((state) => state.project.runningOutput)

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
    <>
      <TopBar project={project} />
      <div className={style.main}>
        {frontProjectView === ProjectView.BrowserView && !!element && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            <Controllers />
          </div>
        )}

        <div className={style.content}>
          {loading && (
            <Box mb={4}>
              <PuffLoader loading={loading} color="#4FD1C5" />
            </Box>
          )}

          {(frontProjectView === ProjectView.Debugging || frontProjectView === ProjectView.FileStatus) && (
            <CloseButton
              size="lg"
              colorScheme="gray"
              className={style.closebtn}
              onClick={() => {
                setFrontProjectView(ProjectView.BrowserView)
              }}
            />
          )}

          {frontProjectView === ProjectView.Debugging && (
            <div className={style.output}>
              {runningOutput.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
          )}

          {frontProjectView === ProjectView.FileStatus && (
            <>
              {project.changes?.length !== 0 && (
                <Text mb={10}>
                  There are {project.changes?.length} files to be pushed
                  <Button ml={4} lefticon={<VscRepoPush />} onClick={() => callPush()}>
                    Push
                  </Button>
                </Text>
              )}
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
      </div>
    </>
  )
}

export default ProjectPage
