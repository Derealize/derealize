import React, { useCallback } from 'react'
import { Text, Button, List, ListItem } from '@chakra-ui/react'
import { useStoreState } from './reduxStore'
import { Project } from './models/project.interface'
import type { ElementHistory } from './models/element'

import style from './Elements.module.scss'

const Historys: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const historys = useStoreState<Array<ElementHistory>>((state) => state.element.frontHistory)

  if (!project) return <></>

  return (
    <List spacing={2}>
      {historys?.map((his) => {
        return (
          <ListItem key={his.codePosition} className={style.listitem}>
            <div className={style.className}>{his.actionType.toString()}</div>
            <div className={style.codePosition}>{`${his.codePosition.split('/').slice(-1)}:${his.tagName}`}</div>
            <div className={style.message}>
              {his.dropzoneCodePosition ? `move to:${his.dropzoneCodePosition.split('/').slice(-1)}` : ''}
            </div>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Historys
