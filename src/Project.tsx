import React, { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { Text, Button, List, ListItem, ListIcon, useToast, Box, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project, ProjectView } from './models/project'
import type { ElementPayload } from './interface'
import type { CommitLog, BoolReply } from './backend/backend.interface'
import { Handler } from './backend/backend.interface'
import TopBar from './components/TopBar'
import Controllers from './components/controllers/Controllers'
import style from './Project.module.scss'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { sendBackIpc } = window.derealize

const ProjectPage: React.FC = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)
  const setProjectView = useStoreActions((actions) => actions.project.setProjectView)
  const savedElements = useStoreActions((actions) => actions.project.savedElements)

  const historys = useStoreState<Array<CommitLog>>((state) => state.project.historys)
  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

  const pendingElements = useMemo(() => {
    return project?.elements?.filter((el) => el.pending)
  }, [project?.elements])

  const callPush = useCallback(async () => {
    if (!project) return null

    const reply = (await sendBackIpc(Handler.Push, { projectId: project.id })) as BoolReply
    if (reply.error) {
      toast({
        title: `Push error: ${reply.error}`,
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
    <>
      <TopBar />
      <div className={style.main}>
        {project.view === ProjectView.BrowserView && !!element && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            <Controllers />
          </div>
        )}

        <div className={style.content}>
          {project.startloading && (
            <Box mb={4}>
              <PuffLoader loading={project.startloading} color="#4FD1C5" />
            </Box>
          )}

          {project.view !== ProjectView.BrowserView && (
            <CloseButton
              size="lg"
              colorScheme="gray"
              className={style.closebtn}
              onClick={() => {
                setProjectView({ projectId: project.id, view: ProjectView.BrowserView })
              }}
            />
          )}

          {project.view === ProjectView.Debugging && (
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
          )}

          {project.view === ProjectView.FileStatus && (
            <>
              {project.changes?.length !== 0 && (
                <Text mb={10}>
                  Here are {project.changes?.length} files waiting to be pushed
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

          {project.view === ProjectView.Elements && (
            <>
              {pendingElements?.length !== 0 && (
                <Text mb={10}>
                  Here are {pendingElements?.length} elements waiting to be saved
                  <Button ml={4} lefticon={<VscRepoPush />} onClick={() => savedElements(project.id)}>
                    Save
                  </Button>
                </Text>
              )}
              <List spacing={2}>
                {pendingElements?.map((el) => {
                  return (
                    <ListItem
                      key={el.codePosition}
                      className={style.listitem}
                      color={el.selected ? 'teal.400' : 'gray.400'}
                    >
                      <span className={style.data}>{el.codePosition}</span>
                      <span className={style.author}>{el.selector}</span>
                      <span className={style.message}>
                        {el.dropzoneCodePosition ? `drop to:${el.dropzoneCodePosition}` : el.className}
                      </span>
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
