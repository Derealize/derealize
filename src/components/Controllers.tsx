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
import { MdBorderStyle } from 'react-icons/md'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './Controllers.module.scss'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Controllers: React.FC<Props> = ({ project }: Props): JSX.Element => {
  return (
    <div className={style.components}>
      <div className={style.head}>
        <div className={style.title}>DIV</div>
      </div>
      <div className={style.controllers}>
        <Tabs orientation="vertical" colorScheme="teal">
          <TabList>
            <Tab p={3}>
              <Tooltip label="Common (F1)">
                <Box>
                  <Icon as={IoApps} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Layout (F2)">
                <Box>
                  <Icon as={BsLayoutWtf} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Alignment (F3)">
                <Box>
                  <Icon as={AiOutlineAlignCenter} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Spacing (F4)">
                <Box>
                  <Icon as={CgSpaceBetweenV} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Size (F5)">
                <Box>
                  <Icon as={GiResize} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Typography (F6)">
                <Box>
                  <Icon as={BsType} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Background (F7)">
                <Box>
                  <Icon as={IoImageOutline} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Border (F8)">
                <Box>
                  <Icon as={MdBorderStyle} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Effects (F9)">
                <Box>
                  <Icon as={GrThreeDEffects} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Components (F10)">
                <Box>
                  <Icon as={CgComponents} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
            <Tab p={3}>
              <Tooltip label="Interactivity (F11)">
                <Box>
                  <Icon as={AiOutlineInteraction} boxSize={6} />
                </Box>
              </Tooltip>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>Commonly!</p>
            </TabPanel>
            <TabPanel>
              <p>Layout!</p>
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
    </div>
  )
}

export default Controllers
