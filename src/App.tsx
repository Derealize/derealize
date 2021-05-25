import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './reduxStore'
import type { Project } from './models/project'
import Home from './Home'
import TabBar from './components/TabBar'
import ImportProject from './components/Import'
import EditProject from './components/Edit'
import ProjectView from './Project'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoadStore = useStoreActions((actions) => actions.profile.loadStore)
  const projectLoadStore = useStoreActions((actions) => actions.project.loadStore)
  const workspaceLoadStore = useStoreActions((actions) => actions.workspace.loadStore)
  const libraryLoadStore = useStoreActions((actions) => actions.library.loadStore)

  const projectListen = useStoreActions((actions) => actions.project.listen)
  const projectUnListen = useStoreActions((actions) => actions.project.unlisten)

  const elementListen = useStoreActions((actions) => actions.element.listen)
  const elementUnListen = useStoreActions((actions) => actions.element.unlisten)

  const frontProject = useStoreState<Project | undefined>((state) => state.project.frontProject)

  useEffect(() => {
    profileLoadStore()
    projectLoadStore()
    workspaceLoadStore()
    libraryLoadStore()

    projectListen()
    elementListen()
    return () => {
      projectUnListen()
      elementUnListen()
    }
  }, [
    workspaceLoadStore,
    profileLoadStore,
    libraryLoadStore,
    projectLoadStore,
    projectListen,
    projectUnListen,
    elementListen,
    elementUnListen,
  ])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>{frontProject ? <ProjectView /> : <Home />}</div>
      <ImportProject />
      <EditProject />
    </div>
  )
}

export default App
