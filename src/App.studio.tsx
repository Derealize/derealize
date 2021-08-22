import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './reduxStore'
import type { ProjectStd } from './models/project.interface'
import Home from './Home.studio'
import TabBar from './components/TabBar'
import ImportModal from './components/ImportModal.studio'
import EditProject from './components/Edit.studio'
import ProjectView from './Project.studio'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const profileLoadStore = useStoreActions((actions) => actions.profile.loadStore)
  const projectLoadStore = useStoreActions((actions) => actions.projectStd.loadStore)
  const workspaceLoadStore = useStoreActions((actions) => actions.workspace.loadStore)
  const libraryLoadStore = useStoreActions((actions) => actions.library.loadStore)

  const projectListen = useStoreActions((actions) => actions.projectStd.listen)
  const projectUnListen = useStoreActions((actions) => actions.projectStd.unlisten)

  const elementListen = useStoreActions((actions) => actions.element.listen)
  const elementUnListen = useStoreActions((actions) => actions.element.unlisten)

  const checkFirewall = useStoreActions((actions) => actions.profile.checkFirewall)
  const frontProject = useStoreState<ProjectStd | undefined>((state) => state.projectStd.frontProject)

  useEffect(() => {
    profileLoadStore()
    projectLoadStore()
    workspaceLoadStore()
    libraryLoadStore()
    checkFirewall()

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
    checkFirewall,
  ])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>{frontProject ? <ProjectView /> : <Home />}</div>
      <ImportModal />
      <EditProject />
    </div>
  )
}

export default App
