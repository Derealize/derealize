import React, { useState, useEffect } from 'react'
import {
  Tooltip,
  Stack,
  Checkbox,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { IoApps, IoImageOutline } from 'react-icons/io5'
import { BsLayoutWtf, BsType } from 'react-icons/bs'
import { AiOutlineAlignCenter, AiOutlineInteraction } from 'react-icons/ai'
import { CgSpaceBetweenV, CgComponents } from 'react-icons/cg'
import { GiResize } from 'react-icons/gi'
import { GrThreeDEffects } from 'react-icons/gr'
import { RiFileList2Line } from 'react-icons/ri'
import { MdBorderStyle } from 'react-icons/md'
import type { Project } from '../../models/project'
import { useStoreActions, useStoreState } from '../../reduxStore'
import Layout from './Layout'
import style from './Controllers.module.scss'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Controllers: React.FC<Props> = ({ project }: Props): JSX.Element => {
  return (
    <div className={style.controllers}>
      <Tabs orientation="vertical" colorScheme="teal">
        <TabList>
          <Tab p={3}>
            <Tooltip label="(F1) Already">
              <Box>
                <Icon as={RiFileList2Line} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F2) Layout Flex Grid Table">
              <Box>
                <Icon as={BsLayoutWtf} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F3) Spacing">
              <Box>
                <Icon as={CgSpaceBetweenV} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F4) Size">
              <Box>
                <Icon as={GiResize} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F5) Typography">
              <Box>
                <Icon as={BsType} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F6) Background">
              <Box>
                <Icon as={IoImageOutline} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F7) Border">
              <Box>
                <Icon as={MdBorderStyle} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F8) Effects Transition Transform">
              <Box>
                <Icon as={GrThreeDEffects} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F9) Components">
              <Box>
                <Icon as={CgComponents} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F10) Interactivity">
              <Box>
                <Icon as={AiOutlineInteraction} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>Already</p>
          </TabPanel>
          <TabPanel>
            <Layout project={project} />
          </TabPanel>
          <TabPanel>
            <p>Alignment!</p>
          </TabPanel>
          <TabPanel>
            <p>Spacing!</p>
          </TabPanel>
          <TabPanel>
            <p>Size!</p>
          </TabPanel>
          <TabPanel>
            <p>Typography!</p>
          </TabPanel>
          <TabPanel>
            <p>Border!</p>
          </TabPanel>
          <TabPanel>
            <p>Background!</p>
          </TabPanel>
          <TabPanel>
            <p>Effects! transitions,animation,transforms,</p>
          </TabPanel>
          <TabPanel>
            <p>Components! Table</p>
          </TabPanel>
          <TabPanel>
            <p>Interactivity!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default Controllers
