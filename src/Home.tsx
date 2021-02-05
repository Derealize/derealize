import React, { useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Grid, Box, GridItem, Button } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import style from './Home.module.scss'

const Home = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projects = useStoreState<Array<Project>>((state) => state.project.projects)

  return (
    <div className={style.home}>
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList justifyContent="center">
          <Tab mx={1}>Project</Tab>
          <Tab mx={1}>Library</Tab>
          <Tab mx={1}>Profile</Tab>
          <Tab mx={1}>Team</Tab>
          <Tab mx={1}>Community</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className={style.projects}>
            <Grid templateColumns="repeat(5, 1fr)" gap={6} mt={2}>
              {projects.map((p) => (
                <Box className={style.project} key={p.url} w="xs" boxShadow="md">
                  <div className={style.pattern} />
                  <div className={style.content}>
                    <h4>{p.name}</h4>
                    <div className={style.infos}>{p.editedTime}</div>
                  </div>
                </Box>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <p>Library!</p>
          </TabPanel>
          <TabPanel>
            <p>Profile!</p>
          </TabPanel>
          <TabPanel>
            <p>Team!</p>
          </TabPanel>
          <TabPanel>
            <p>Community!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default Home
