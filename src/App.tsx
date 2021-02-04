import React, { useEffect, Suspense } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Container, Button } from '@chakra-ui/react'
import cs from 'classnames'
import { BounceLoader } from 'react-spinners'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import Start from './components/Start'
import Home from './Home'
import ProjectPage from './Project'
import TabBar from './components/TabBar'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projectLoad = useStoreActions((actions) => actions.project.load)
  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)

  useEffect(() => {
    // profileLoad()
    // projectLoad()
  }, [profileLoad, projectLoad])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>
        {!frontProject && <Home />}
        {frontProject && (
          <Suspense fallback={<BounceLoader />}>
            <ProjectPage />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default App
