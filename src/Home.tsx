import React, { useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import style from './Home.module.scss'

const Home = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)

  return (
    <div className={style.home}>
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
  )
}

export default Home
