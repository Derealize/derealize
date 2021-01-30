/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState, useRef, useReducer } from 'react'
import cs from 'classnames'
import { MenuItem, MenuList, MenuButton, Menu, IconButton, Container, Button } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faDailymotion } from '@fortawesome/free-brands-svg-icons'
import { faCaretSquareDown } from '@fortawesome/free-regular-svg-icons'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
import css from './Tabs.module.scss'

const Tabs = (): JSX.Element => {
  const openedProjects = useStoreState<Array<Project>>((state) => state.project.openedProjects)
  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  return (
    <div className={css.tabs}>
      <div
        className={cs(css.tab, css.maintab, { [css.front]: frontProject === null })}
        onClick={() => {
          setFrontProject(null)
        }}
        tabIndex={0}
        role="button"
      >
        <FontAwesomeIcon icon={faDailymotion} />
        <span>Derealize</span>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FontAwesomeIcon icon={faCaretSquareDown} className={css.menu} />}
            size="xs"
            variant="outline"
          />
          <MenuList>
            <MenuItem command="⌘T">New Tab</MenuItem>
            <MenuItem command="⌘N">New Window</MenuItem>
            <MenuItem command="⌘⇧N">Open Closed Tab</MenuItem>
            <MenuItem command="⌘O">Open File...</MenuItem>
          </MenuList>
        </Menu>
      </div>
      {openedProjects.map((p, i) => (
        <div
          className={cs(css.tab, { [css.front]: p.url === frontProject?.url })}
          key={p.url}
          onClick={() => {
            setFrontProject(p)
          }}
          tabIndex={i + 1}
          role="button"
        >
          {p.name}
        </div>
      ))}
      <div className={css.plus}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  )
}

export default Tabs
