import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './reduxStore'
import Project from './models/project.interface'
import Home from './Home'
import TabBar from './components/TabBar'
import ImportProject from './components/Import'
import ProjectView from './Project'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoadStore = useStoreActions((actions) => actions.profile.loadStore)
  const projectLoadStore = useStoreActions((actions) => actions.project.loadStore)
  const workspaceLoadStore = useStoreActions((actions) => actions.workspace.loadStore)
  const libraryLoadStore = useStoreActions((actions) => actions.library.loadStore)

  const projectListen = useStoreActions((actions) => actions.project.listen)
  const projectUnListen = useStoreActions((actions) => actions.project.unlisten)

  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)

  useEffect(() => {
    profileLoadStore()
    projectLoadStore()
    workspaceLoadStore()
    libraryLoadStore()

    projectListen()
    return projectUnListen
  }, [workspaceLoadStore, profileLoadStore, libraryLoadStore, projectLoadStore, projectListen, projectUnListen])

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
