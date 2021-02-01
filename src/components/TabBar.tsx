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
import css from './TabBar.module.scss'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

const TabBar = (): JSX.Element => {
  const openedProjects = useStoreState<Array<Project>>((state) => state.project.openedProjects)
  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  return (
    <header className={css.tabbar}>
      <div className={css.dragRegion}>
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

        <div className={css.controls}>
          <div
            className={cs(css.button, css.minButton)}
            onClick={() => {
              window.controls('minimize')
            }}
            role="button"
            tabIndex={0}
          >
            <img
              srcSet="styles/icons/min-w-10.png 1x, styles/icons/min-w-12.png 1.25x, styles/icons/min-w-15.png 1.5x, styles/icons/min-w-15.png 1.75x, styles/icons/min-w-20.png 2x, styles/icons/min-w-20.png 2.25x, styles/icons/min-w-24.png 2.5x, styles/icons/min-w-30.png 3x, styles/icons/min-w-30.png 3.5x"
              draggable="false"
              alt="icon"
            />
          </div>

          <div
            className={cs(css.button, css.maxButton)}
            onClick={() => {
              window.controls('maximize')
            }}
            role="button"
            tabIndex={0}
          >
            <img
              srcSet="styles/icons/max-w-10.png 1x, styles/icons/max-w-12.png 1.25x, styles/icons/max-w-15.png 1.5x, styles/icons/max-w-15.png 1.75x, styles/icons/max-w-20.png 2x, styles/icons/max-w-20.png 2.25x, styles/icons/max-w-24.png 2.5x, styles/icons/max-w-30.png 3x, styles/icons/max-w-30.png 3.5x"
              draggable="false"
              alt="icon"
            />
          </div>

          <div
            className={cs(css.button, css.restoreButton)}
            onClick={() => {
              window.controls('unmaximize')
            }}
            role="button"
            tabIndex={0}
          >
            <img
              srcSet="styles/icons/restore-w-10.png 1x, styles/icons/restore-w-12.png 1.25x, styles/icons/restore-w-15.png 1.5x, styles/icons/restore-w-15.png 1.75x, styles/icons/restore-w-20.png 2x, styles/icons/restore-w-20.png 2.25x, styles/icons/restore-w-24.png 2.5x, styles/icons/restore-w-30.png 3x, styles/icons/restore-w-30.png 3.5x"
              draggable="false"
              alt="icon"
            />
          </div>

          <div
            className={cs(css.button, css.closeButton)}
            onClick={() => {
              window.controls('close')
            }}
            role="button"
            tabIndex={0}
          >
            <img
              srcSet="styles/icons/close-w-10.png 1x, styles/icons/close-w-12.png 1.25x, styles/icons/close-w-15.png 1.5x, styles/icons/close-w-15.png 1.75x, styles/icons/close-w-20.png 2x, styles/icons/close-w-20.png 2.25x, styles/icons/close-w-24.png 2.5x, styles/icons/close-w-30.png 3x, styles/icons/close-w-30.png 3.5x"
              draggable="false"
              alt="icon"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default TabBar
