import React, { useCallback } from 'react'
import { Text, Button, List, ListItem } from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull } from 'react-icons/vsc'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project.interface'
import type { ElementState } from './models/element'
import style from './Project.module.scss'

const ProjectPage: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)
  const savedElements = useStoreActions((actions) => actions.element.savedElements)

  if (!project) return <></>

  return (
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
            <ListItem key={el.codePosition} className={style.listitem} color={el.selected ? 'teal.400' : 'gray.400'}>
              <span className={style.data}>{el.codePosition.split('/').slice(-1)}</span>
              <span className={style.author}>{el.selector}</span>
              <span className={style.message}>
                {el.dropzoneCodePosition ? `move to:${el.dropzoneCodePosition.split('/').slice(-1)}` : el.className}
              </span>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default ProjectPage
