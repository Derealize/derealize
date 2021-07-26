import React, { useCallback } from 'react'
import { CloseButton, Button, Text } from '@chakra-ui/react'
import { BounceLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project, ProjectView } from './models/project.interface'
import type { ElementState } from './models/element'
import TopBar from './components/TopBar'
import Controllers from './components/controllers/Controllers'
import Elements from './Historys'
import ImagesModal from './components/ImagesModal'
import ColorsModal from './components/ColorsModal'
import { ReactComponent as LoadFailSvg } from './styles/images/undraw_refreshing_beverage_td3r.svg'
import style from './Project.module.scss'
import { MainIpcChannel } from './interface'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { sendMainIpc } = window.derealize

const ProjectPage: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

  if (!project) return <></>
  console.log('pg.rt', project.viewHistory, element)
  return (
    <>
      <TopBar />
      <ImagesModal />
      <ColorsModal />
      <div className={style.main}>
        {project.view === ProjectView.BrowserView && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            {!project.viewHistory && !!element && <Controllers />}
            {project.viewHistory && <Elements />}
          </div>
        )}

        <div className={style.content}>
          {project.view === ProjectView.Loading && <BounceLoader color="#4FD1C5" />}

          {project.view === ProjectView.LoadFail && (
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
        </div>
      </div>
    </>
  )
}

export default ProjectPage
