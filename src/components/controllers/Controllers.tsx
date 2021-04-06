import React, { useState, useEffect } from 'react'
import { Tooltip, Stack, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { IoImageOutline, IoGridOutline } from 'react-icons/io5'
import { BsType } from 'react-icons/bs'
import { AiOutlineAlignCenter, AiOutlineInteraction } from 'react-icons/ai'
import { CgSpaceBetweenV, CgComponents } from 'react-icons/cg'
import { GiResize } from 'react-icons/gi'
import { GrThreeDEffects } from 'react-icons/gr'
import { RiFileList2Line, RiLayoutMasonryLine, RiLayoutGridLine } from 'react-icons/ri'
import { MdBorderStyle, MdGridOn } from 'react-icons/md'
import Already from './Already'
import LayoutSection from './layout/LayoutSection'
import FlexSection from './flex/FlexSection'
import SpacingSection from './spacing/SpacingSection'
import style from './Controllers.module.scss'

const Controllers: React.FC = (): JSX.Element => {
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
            <Tooltip label="(F2) Layout/Flex/Grid">
              <Box>
                <Icon as={IoGridOutline} boxSize={6} />
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
            <Tooltip label="(F4) Border">
              <Box>
                <Icon as={MdBorderStyle} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F5) Background">
              <Box>
                <Icon as={IoImageOutline} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F6) Typography">
              <Box>
                <Icon as={BsType} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F7) Effects/Transition/Transform">
              <Box>
                <Icon as={GrThreeDEffects} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F8) Components/Table">
              <Box>
                <Icon as={CgComponents} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
          <Tab p={3}>
            <Tooltip label="(F9) Interactivity">
              <Box>
                <Icon as={AiOutlineInteraction} boxSize={6} />
              </Box>
            </Tooltip>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Already />
          </TabPanel>
          <TabPanel>
            <LayoutSection />
            <FlexSection />
          </TabPanel>
          <TabPanel>
            <SpacingSection />
          </TabPanel>
          <TabPanel>
            <p>Border!</p>
          </TabPanel>
          <TabPanel>
            <p>Background!</p>
          </TabPanel>
          <TabPanel>
            <p>Typography!</p>
          </TabPanel>
          <TabPanel>
            <p>Effects/Transition/Animation/Transform</p>
          </TabPanel>
          <TabPanel>
            <p>Components/Table</p>
          </TabPanel>
          <TabPanel>
            <p>Interactivity</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default Controllers
