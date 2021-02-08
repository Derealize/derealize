import React, { useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Grid, Box, HStack, Flex, Button } from '@chakra-ui/react'
import dayjs from 'dayjs'
import cs from 'classnames'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import style from './Home.module.scss'

const Home = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const setModalOpen = useStoreActions((actions) => actions.project.setModalOpen)

  return (
    <div className={style.home}>
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList justifyContent="center">
          <Tab mx={1}>Project</Tab>
          <Tab mx={1}>Library</Tab>
          <Tab mx={1}>Profile</Tab>
          <Tab mx={1}>Team</Tab>
          <Tab mx={1}>Community</Tab>
          <Tab mx={1}>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className={style.projects} flexDirection="column">
            <HStack spacing={4} my={6} justifyContent="center">
              <Button
                onClick={() => setModalOpen()}
                leftIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                colorScheme="pink"
                variant="solid"
              >
                Create
              </Button>
              <Button leftIcon={<FontAwesomeIcon icon={faFolderOpen} />} colorScheme="teal" variant="outline">
                Open
              </Button>
            </HStack>
            <Flex mt={6} wrap="wrap">
              {projects.map((p) => (
                <Box className={style.project} key={p.url} w="xs" boxShadow="md">
                  <div className={style.pattern} />
                  <div className={style.content}>
                    <h4>{p.name}</h4>
                    <div className={style.infos}>{dayjs(p.editedTime).fromNow()} edited</div>
                  </div>
                </Box>
              ))}
            </Flex>
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
          <TabPanel>
            <p>Settings!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default Home
