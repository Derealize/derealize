/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState, useRef } from 'react'
import cs from 'classnames'
import { IconButton, Container, Button } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
import useHotkeys from '../utils/useHotkeys'
import ChromeTabs from '../utils/chrome-tabs'
import css from './TabBar.module.scss'
import { ReactComponent as BackgroundSvg } from '../styles/chrome-tabs/background.svg'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

const TabBar = (): JSX.Element => {
  const chromeTabs = useRef<any>()
  const openedProjects = useStoreState<Array<Project>>((state) => state.project.openedProjects)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  useEffect(() => {
    const el = document.querySelector('.chrome-tabs')
    if (!el) return

    chromeTabs.current = new ChromeTabs()
    chromeTabs.current.init(el)
  }, [])

  useHotkeys(
    'ctrl+t',
    () => {
      chromeTabs.current.addTab({
        title: 'New Tab',
        favicon: false,
      })
    },
    [],
  )

  return (
    <header className={css.tabbar}>
      <div className="chrome-tabs">
        <div className="chrome-tabs-content">
          {/*
            // @ts-ignore */}
          <div className={cs('chrome-tab', css.maintab)} active="true" fixed="true">
            <div className="chrome-tab-dividers" />
            <div className="chrome-tab-background">
              <BackgroundSvg />
            </div>
            <div className="chrome-tab-content">
              <div className="chrome-tab-favicon" />
              <div className="chrome-tab-title">Derealize</div>
              <div className="chrome-tab-drag-handle" />
              <FontAwesomeIcon icon={faBars} className={css.menu} />
            </div>
          </div>

          {openedProjects.map((p, i) => (
            <div
              key={p.url}
              className="chrome-tab"
              onClick={() => {
                setFrontProject(p)
              }}
              tabIndex={i + 1}
              role="button"
            >
              <div className="chrome-tab-dividers" />
              <div className="chrome-tab-background">
                <BackgroundSvg />
              </div>
              <div className="chrome-tab-content">
                <div className="chrome-tab-favicon" />
                <div className="chrome-tab-title">{p.name}</div>
                <div className="chrome-tab-drag-handle" />
                <div className="chrome-tab-close" />
              </div>
            </div>
          ))}
        </div>
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
            srcSet="styles/icons/min-k-10.png 1x, styles/icons/min-k-12.png 1.25x, styles/icons/min-k-15.png 1.5x, styles/icons/min-k-15.png 1.75x, styles/icons/min-k-20.png 2x, styles/icons/min-k-20.png 2.25x, styles/icons/min-k-24.png 2.5x, styles/icons/min-k-30.png 3x, styles/icons/min-k-30.png 3.5x"
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
            srcSet="styles/icons/max-k-10.png 1x, styles/icons/max-k-12.png 1.25x, styles/icons/max-k-15.png 1.5x, styles/icons/max-k-15.png 1.75x, styles/icons/max-k-20.png 2x, styles/icons/max-k-20.png 2.25x, styles/icons/max-k-24.png 2.5x, styles/icons/max-k-30.png 3x, styles/icons/max-k-30.png 3.5x"
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
            srcSet="styles/icons/restore-k-10.png 1x, styles/icons/restore-k-12.png 1.25x, styles/icons/restore-k-15.png 1.5x, styles/icons/restore-k-15.png 1.75x, styles/icons/restore-k-20.png 2x, styles/icons/restore-k-20.png 2.25x, styles/icons/restore-k-24.png 2.5x, styles/icons/restore-k-30.png 3x, styles/icons/restore-k-30.png 3.5x"
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
            srcSet="styles/icons/close-k-10.png 1x, styles/icons/close-k-12.png 1.25x, styles/icons/close-k-15.png 1.5x, styles/icons/close-k-15.png 1.75x, styles/icons/close-k-20.png 2x, styles/icons/close-k-20.png 2.25x, styles/icons/close-k-24.png 2.5x, styles/icons/close-k-30.png 3x, styles/icons/close-k-30.png 3.5x"
            draggable="false"
            alt="icon"
          />
        </div>
      </div>
    </header>
  )
}

export default TabBar
