import React, { useEffect } from 'react'
import cs from 'classnames'
import { useStoreActions, useStoreState } from './reduxStore'
import Project from './models/project.interface'
import Home from './Home'
import TabBar from './components/TabBar'
import ImportProject from './components/Import'
import ProjectView from './Project'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projectLoad = useStoreActions((actions) => actions.project.load)
  const projectListen = useStoreActions((actions) => actions.project.listen)
  const projectUnListen = useStoreActions((actions) => actions.project.unlisten)

  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)

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
        {frontProject && <ProjectView project={frontProject} />}
      </div>
      <ImportProject />
    </div>
  )
}

export default App
