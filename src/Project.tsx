import React, { useCallback } from 'react'
import { Text, Button, List, ListItem, CloseButton } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project, ProjectView } from './models/project.interface'
import type { ElementState } from './models/element'
import TopBar from './components/TopBar'
import Controllers from './components/controllers/Controllers'
import ImagesModal from './components/ImagesModal'
import ColorsModal from './components/ColorsModal'
import style from './Project.module.scss'

const ProjectPage: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)

  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)
  const setProjectView = useStoreActions((actions) => actions.project.setProjectView)
  const savedElements = useStoreActions((actions) => actions.element.savedElements)

  const barWidth = useStoreState<number>((state) => state.workspace.barWidth)

  if (!project) return <></>

  return (
    <>
      <TopBar />
      <ImagesModal />
      <ColorsModal />
      <div className={style.main}>
        {project.view === ProjectView.BrowserView && !!element && (
          <div className={style.controllers} style={{ flexBasis: barWidth }}>
            <Controllers />
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
                      <span className={style.data}>{el.codePosition.split('/').slice(-1)}</span>
                      <span className={style.author}>{el.selector}</span>
                      <span className={style.message}>
                        {el.dropzoneCodePosition
                          ? `move to:${el.dropzoneCodePosition.split('/').slice(-1)}`
                          : el.className}
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
