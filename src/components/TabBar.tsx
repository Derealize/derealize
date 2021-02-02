/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState, useRef } from 'react'
import cs from 'classnames'
import { IconButton, Container, Button } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
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

    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 't') {
        chromeTabs.current.addTab({
          title: 'New Tab',
          favicon: false,
        })
      }
    })
  }, [])

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
              <div className="chrome-tab-close" />
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

      {/* <div
        className={css.plus}
        onClick={() => {
          chromeTabs.current.addTab({
            title: 'New Tab',
            favicon: false,
          })
        }}
        role="button"
        tabIndex={openedProjects.length + 2}
      >
        <FontAwesomeIcon icon={faPlus} />
      </div> */}

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
    </header>
  )
}

export default TabBar
