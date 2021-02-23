import React, { useEffect, Suspense } from 'react'
import cs from 'classnames'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import Home from './Home'
import ProjectPage from './Project'
import TabBar from './components/TabBar'
import ImportProject from './components/Import'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projectLoad = useStoreActions((actions) => actions.project.load)
  const projectListen = useStoreActions((actions) => actions.project.listen)
  const projectUnListen = useStoreActions((actions) => actions.project.unlisten)

  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  useEffect(() => {
    profileLoad()
    projectLoad()
    projectListen()

    return projectUnListen
  }, [profileLoad, projectListen, projectLoad, projectUnListen])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>
        {!frontProject && <Home />}
        {frontProject && (
          <Suspense fallback={<PuffLoader />}>
            <ProjectPage />
          </Suspense>
        )}
      </div>
      <ImportProject />
    </div>
  )
}

export default App
