import React, { useEffect } from 'react'
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
  MenuDivider,
  VStack,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { FiPlusCircle } from 'react-icons/fi'
import { FaBars } from 'react-icons/fa'
import { useStoreActions, useStoreState } from './reduxStore'
import type { ProjectWithRuntime } from './models/project.interface'
import { Handler } from './backend/backend.interface'
import style from './Home.module.scss'
import type { PreloadWindow } from './preload'
import { MainIpcChannel } from './interface'
import { ReactComponent as WelcomeSvg } from './styles/images/undraw_experience_design_eq3j.svg'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

const HomeWithRuntime = (): JSX.Element => {
  const projects = useStoreState<Array<ProjectWithRuntime>>((state) => state.projectWithRuntime.projects)
  const toggleImportModal = useStoreActions((actions) => actions.projectWithRuntime.toggleImportModal)
  const setEditingProject = useStoreActions((actions) => actions.projectWithRuntime.setEditingProject)
  const openProject = useStoreActions((actions) => actions.projectWithRuntime.openProject)
  const removeProject = useStoreActions((actions) => actions.projectWithRuntime.removeProjectThunk)

  // useEffect(() => {
  //   toggleImportModal(!projects.length)
  // }, [projects.length, toggleImportModal])

  return (
    <div className={style.home}>
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList justifyContent="center">
          {/* <Tab mx={1}>Project</Tab>
          <Tab mx={1} isDisabled>
            Library
          </Tab>
          <Tab mx={1} isDisabled>
            Profile
          </Tab>
          <Tab mx={1} isDisabled>
            Team
          </Tab>
          <Tab mx={1} isDisabled>
            Community
          </Tab>
          <Tab mx={1} isDisabled>
            Settings
          </Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel className={style.projects} flexDirection="column">
            <HStack spacing={4} my={6} justifyContent="center">
              <Button
                onClick={() => toggleImportModal(true)}
                leftIcon={<FiPlusCircle />}
                colorScheme="pink"
                variant="solid"
              >
                Import
              </Button>
            </HStack>

            {!projects.length && (
              <VStack className={style.welcome}>
                <WelcomeSvg className={style.undraw} />
                <div className="prose">
                  Before importing your project, please follow{' '}
                  <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                    our documentation
                  </a>{' '}
                  to complete the project configuration.
                </div>
              </VStack>
            )}

            <Wrap mt={6} spacing={8}>
              {projects.map((p) => (
                <WrapItem key={p.id}>
                  <Box
                    w="xs"
                    boxShadow="md"
                    borderRadius="md"
                    className={style.project}
                    onClick={() => openProject(p.id)}
                  >
                    <div className={style.pattern} />
                    <Flex align="center">
                      <Box className={style.content}>
                        <Text className={style.name} as="kbd" isTruncated>
                          {p.name}
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
                          icon={<FaBars />}
                          size="xs"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <MenuList>
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              openProject(p.id)
                            }}
                          >
                            Open
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              sendMainIpc(MainIpcChannel.OpenPath, p.path)
                            }}
                          >
                            Open Folder
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingProject(p.id)
                            }}
                          >
                            Edit
                          </MenuItem>
                          {!!p.changes?.length && (
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                sendBackIpc(Handler.Push, { projectId: p.id })
                              }}
                            >
                              Push {p.changes.length} files
                            </MenuItem>
                          )}
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              sendBackIpc(Handler.Pull, { projectId: p.id })
                            }}
                          >
                            Pull
                          </MenuItem>
                          {/* <MenuItem>Share</MenuItem> */}
                          <MenuDivider />
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              removeProject(p.id)
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

export default HomeWithRuntime
