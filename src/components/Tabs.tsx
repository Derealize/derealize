import React, { useCallback, useEffect, useState, useRef, useReducer } from 'react'
// import { faSearch, faAngleDoubleLeft, faAngleDoubleRight, faCubes, faHome } from '@fortawesome/free-solid-svg-icons'
import { faDailymotion } from '@fortawesome/free-brands-svg-icons'
// import { faListAlt, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
import css from './Tabs.module.scss'

const Tabs = (): JSX.Element => {
  const openedProjects = useStoreState<Array<Project>>((state) => state.project.openedProjects)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  return (
    <div className={css.tabs}>
      <div className={css.maintab}>Derealize</div>
      {openedProjects.map((p) => (
        <div key={p.url}>{p.name}</div>
      ))}
    </div>
  )
}

export default Tabs
