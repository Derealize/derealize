import React, { useState } from 'react'
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Wrap,
  WrapItem,
  Box,
  Text,
  Spacer,
  HStack,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import cs from 'classnames'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPlusCircle, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import style from './Home.module.scss'

const Home = (): JSX.Element => {
  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const setModalOpen = useStoreActions((actions) => actions.project.setModalOpen)
  const openProject = useStoreActions((actions) => actions.project.openProject)
  const removeProject = useStoreActions((actions) => actions.project.removeProject)

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
                Import
              </Button>
            </HStack>
            <Wrap mt={6} spacing={4}>
              {projects.map((p) => (
                <WrapItem key={p.url}>
                  <Box
                    w="xs"
                    boxShadow="md"
                    borderRadius="md"
                    className={style.project}
                    onClick={() => openProject(p.url)}
                  >
                    <div className={style.pattern} />
                    <Flex align="center">
                      <Box className={style.content}>
                        <Text className={style.name} as="kbd" isTruncated>
                          {p.name}
                        </Text>
                        <Text color="gray.500" isTruncated>
                          {p.productName}
                        </Text>
                        <Text color="gray.400" fontSize="xs">
                          {dayjs(p.editedTime).fromNow()} edited
                        </Text>
                      </Box>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          mr={2}
                          as={IconButton}
                          aria-label="Options"
                          icon={<FontAwesomeIcon icon={faBars} />}
                          size="xs"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <MenuList>
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              openProject(p.url)
                            }}
                          >
                            Open
                          </MenuItem>
                          <MenuItem>Share</MenuItem>
                          <MenuItem>Rename</MenuItem>
                          <MenuDivider />
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              removeProject(p.url)
                            }}
                          >
                            Remove
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
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
