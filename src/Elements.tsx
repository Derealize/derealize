import React, { useCallback } from 'react'
import { Text, Button, List, ListItem } from '@chakra-ui/react'
import { useStoreState } from './reduxStore'
import { Project } from './models/project.interface'
import type { ElementState } from './models/element'
import style from './Elements.module.scss'

const ProjectPage: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)

  if (!project) return <></>

  return (
    <List spacing={2}>
      {pendingElements?.map((el) => {
        return (
          <ListItem key={el.codePosition} className={style.listitem} color={el.selected ? 'teal.400' : 'gray.400'}>
            <div>{el.className}</div>
            <div className={style.codePosition}>{el.codePosition.split('/').slice(-1)}</div>
            <div className={style.selector}>{el.selector}</div>
            <div className={style.message}>
              {el.dropzoneCodePosition ? `move to:${el.dropzoneCodePosition.split('/').slice(-1)}` : ''}
            </div>
          </ListItem>
        )
      })}
    </List>
  )
}

export default ProjectPage
