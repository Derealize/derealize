import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './reduxStore'
import Start from './components/Start'

const App = (): JSX.Element => {
  const load = useStoreActions((actions) => actions.profile.load)

  useEffect(() => {
    // load()
  }, [load])

  return <div className="app">Hello World!</div>
}

export default App
