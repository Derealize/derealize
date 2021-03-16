import React, { useCallback } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import dayjs from 'dayjs'
import { Text, Button, List, ListItem, ListIcon, useToast, Box, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import Project, { ProjectView } from './models/project.interface'
import { CommitLog, BoolReply } from './backend/project.interface'
import TopBar from './components/TopBar'
import Controllers from './components/Controllers'
import style from './Project.module.scss'
import { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { send } = window.derealize

type Props = {
  project: Project
}

const ProjectPage: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const toast = useToast()
  const loading = useStoreState<boolean>((state) => state.project.loading)

  const projectView = useStoreState<ProjectView>((state) => state.project.projectView)
  const setProjectView = useStoreActions((actions) => actions.project.setProjectView)

  const historys = useStoreState<Array<CommitLog>>((state) => state.project.historys)
  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

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
    <>
      <TopBar project={project} />
      <div className={style.main}>
        {projectView === ProjectView.BrowserView && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            <Controllers project={project} />
          </div>
        )}

        <div className={style.content}>
          {loading && (
            <Box mb={4}>
              <PuffLoader loading={loading} color="#4FD1C5" />
            </Box>
          )}

          {(projectView === ProjectView.Debugging || projectView === ProjectView.FileStatus) && (
            <CloseButton
              size="lg"
              colorScheme="gray"
              className={style.closebtn}
              onClick={() => {
                setProjectView(ProjectView.BrowserView)
              }}
            />
          )}

          {projectView === ProjectView.Debugging && (
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
          )}

          {projectView === ProjectView.FileStatus && (
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
