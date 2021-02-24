import React, { useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { Project } from './models/project'
import { useStoreActions, useStoreState } from './reduxStore'
import style from './Project.module.scss'

const ProjectPage = (): JSX.Element => {
  const project = useStoreState<Project | null>((state) => state.project.frontProject)

  return (
    <div className={style.project}>
      <p>{project?.name}</p>
      <p>{project?.url}</p>
    </div>
  )
}

export default ProjectPage
