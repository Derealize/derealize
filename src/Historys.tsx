import React from 'react'
import cs from 'classnames'
import { List, ListItem } from '@chakra-ui/react'
import { useStoreState } from './reduxStore'
import { propertyTransClassName } from './utils/assest'
import { Project } from './models/project.interface'
import { ElementHistory, ElementActionType } from './models/element'

import style from './Historys.module.scss'

export const GetHistoryMessage = (history: ElementHistory): string => {
  switch (history.actionType) {
    case ElementActionType.deleteProperty:
      return `remove ${history.property ? propertyTransClassName(history.property) : ''}`
    case ElementActionType.addProperty:
      return `add ${history.property ? propertyTransClassName(history.property) : ''}`
    case ElementActionType.setPropertyValue:
      return `set ${history.className}`
    case ElementActionType.setTag:
      return `setTag ${history.tagName}`
    case ElementActionType.setText:
      return `setText ${history.text}`
    // case ElementActionType.dropped:
    //   return `move to:${history.dropzoneCodePosition ? history.dropzoneCodePosition.split('/').slice(-1) : ''}`
    default:
      console.error('history.actionType unknow', history)
      return 'unknow'
  }
}

const Historys: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const historys = useStoreState<Array<ElementHistory>>((state) => state.element.frontHistory)

  if (!project) return <></>

  return (
    <List spacing={2}>
      {historys?.map((his) => {
        return (
          <ListItem key={his.codePosition} className={cs(style.listitem, { [style.revoked]: his.revoked })}>
            <div className={style.message}>{GetHistoryMessage(his)}</div>
            <div className={style.codePosition}>{`${his.codePosition
              .split('/')
              .slice(-1)}:${his.tagName?.toLocaleLowerCase()}`}</div>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Historys
