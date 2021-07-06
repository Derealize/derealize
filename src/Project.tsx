import React, { useCallback } from 'react'
import { Text, Button, List, ListItem, CloseButton } from '@chakra-ui/react'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project, ProjectView } from './models/project.interface'
import type { ElementState } from './models/element'
import TopBar from './components/TopBar'
import Controllers from './components/controllers/Controllers'
import Elements from './Elements'
import ImagesModal from './components/ImagesModal'
import ColorsModal from './components/ColorsModal'
import LoadFailSvg from './styles/images/undraw_refreshing_beverage_td3r.svg'
import style from './Project.module.scss'

const ProjectPage: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)

  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const setProjectView = useStoreActions((actions) => actions.project.setProjectView)

  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

  if (!project) return <></>

  return (
    <>
      <TopBar />
      <ImagesModal />
      <ColorsModal />
      <div className={style.main}>
        {project.view === ProjectView.BrowserView && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            {!project.viewElements && !!element && <Controllers />}
            {project.viewElements && <Elements />}
          </div>
        )}

        <div className={style.content}>
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

          {project.view === ProjectView.LoadFail && <LoadFailSvg />}
        </div>
      </div>
    </>
  )
}

export default ProjectPage
