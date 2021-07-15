import React, { useCallback } from 'react'
import dayjs from 'dayjs'
import { Text, Button, List, ListItem, ListIcon, useToast, Box, CloseButton } from '@chakra-ui/react'
import { PuffLoader } from 'react-spinners'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { useStoreActions, useStoreState } from './reduxStore'
import { ProjectWithRuntime, ProjectViewWithRuntime } from './models/project.interface'
import type { ElementState } from './models/element'
import type { CommitLog, BoolReply } from './backend/backend.interface'
import { Handler } from './backend/backend.interface'
import TopBar from './components/TopBar.runtime'
import Controllers from './components/controllers/Controllers'
import Elements from './Historys'
import ImagesModal from './components/ImagesModal'
import ColorsModal from './components/ColorsModal'
import { ReactComponent as LoadFailSvg } from './styles/images/undraw_refreshing_beverage_td3r.svg'
import style from './Project.module.scss'
import { MainIpcChannel } from './interface'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

const ProjectPage: React.FC = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<ProjectWithRuntime | undefined>((state) => state.projectWithRuntime.frontProject)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const setProjectView = useStoreActions((actions) => actions.projectWithRuntime.setProjectView)

  const gitHistorys = useStoreState<Array<CommitLog>>((state) => state.projectWithRuntime.gitHistorys)
  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

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
      <ImagesModal />
      <ColorsModal />
      <div className={style.main}>
        {project.view === ProjectViewWithRuntime.BrowserView && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            {!project.viewHistory && !!element && <Controllers />}
            {project.viewHistory && <Elements />}
          </div>
        )}

        <div className={style.content}>
          {project.startloading && (
            <Box mb={4}>
              <PuffLoader loading={project.startloading} color="#4FD1C5" />
            </Box>
          )}

          {project.view !== ProjectViewWithRuntime.BrowserView && (
            <CloseButton
              size="lg"
              colorScheme="gray"
              className={style.closebtn}
              onClick={() => {
                setProjectView({ projectId: project.id, view: ProjectViewWithRuntime.BrowserView })
              }}
            />
          )}

          {project.view === ProjectViewWithRuntime.Loading && <PuffLoader color="#4FD1C5" />}
          {project.view === ProjectViewWithRuntime.LoadFail && (
            <>
              <LoadFailSvg className={style.loadFailSvg} />
              <Text mt={4} fontSize="2xl" className={style.loadFailText}>
                404
              </Text>
              <Text mt={4} className="prose">
                Unable to request the baseUrl:
                <a href={project.config?.baseUrl}>{project.config?.baseUrl}</a> of your project, please follow{' '}
                <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                  our documentation
                </a>{' '}
                to make sure the project is started correctly.
              </Text>
              <Button mt={4} onClick={() => sendMainIpc(MainIpcChannel.Refresh, project.id)}>
                Refresh
              </Button>
            </>
          )}

          {project.view === ProjectViewWithRuntime.Debugging && (
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
          )}

          {project.view === ProjectViewWithRuntime.FileStatus && (
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
                {gitHistorys.map((h) => {
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
