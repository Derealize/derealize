import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './reduxStore'
import type { Project, ProjectWithRuntime } from './models/project.interface'
import Home from './Home'
import TabBar from './components/TabBar'
import ImportModal from './components/ImportModal'
import EditProject from './components/Edit'
import ProjectView from './Project'
import style from './App.module.scss'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { withRuntime } = window.env

const App = (): JSX.Element => {
  const profileLoadStore = useStoreActions((actions) => actions.profile.loadStore)
  const projectLoadStore = useStoreActions((actions) =>
    withRuntime ? actions.projectWithRuntime.loadStore : actions.project.loadStore,
  )
  const workspaceLoadStore = useStoreActions((actions) => actions.workspace.loadStore)
  const libraryLoadStore = useStoreActions((actions) => actions.library.loadStore)

  const projectListen = useStoreActions((actions) =>
    withRuntime ? actions.projectWithRuntime.listen : actions.project.listen,
  )
  const projectUnListen = useStoreActions((actions) =>
    withRuntime ? actions.projectWithRuntime.unlisten : actions.project.unlisten,
  )

  const elementListen = useStoreActions((actions) => actions.element.listen)
  const elementUnListen = useStoreActions((actions) => actions.element.unlisten)

  const frontProject = useStoreState<Project | ProjectWithRuntime | undefined>((state) =>
    withRuntime ? state.projectWithRuntime.frontProject : state.project.frontProject,
  )

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
      <ImportModal />
      <EditProject />
    </div>
  )
}

export default App
