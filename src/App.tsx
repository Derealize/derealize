import React, { useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Container, Button } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import Start from './components/Start'
import TabBar from './components/TabBar'
import style from './App.module.scss'

const App = (): JSX.Element => {
  const load = useStoreActions((actions) => actions.profile.load)

  useEffect(() => {
    // load()
  }, [load])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}

export default App
