import React, { useState, useEffect } from 'react'
import { Tooltip, Stack, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { IoImageOutline, IoGridOutline } from 'react-icons/io5'
import { BsType, BsLayoutTextWindowReverse, BsFileCode } from 'react-icons/bs'
import { AiOutlineAlignCenter, AiOutlineInteraction } from 'react-icons/ai'
import { CgSpaceBetweenV, CgComponents, CgMoreAlt, CgBorderRight } from 'react-icons/cg'
import { GrThreeDEffects } from 'react-icons/gr'
import { RiFileList2Line, RiLayoutMasonryLine, RiLayoutGridLine } from 'react-icons/ri'
import { MdTransform, MdGridOn } from 'react-icons/md'
import { useStoreActions, useStoreState } from '../../reduxStore'
import ControllersContext from './ControllersContext'
import type { Property } from '../../models/controlles/controlles'
import Already from './Already'
import AdvancedSection from './advanced/AdvancedSection'
import LayoutSection from './layout/LayoutSection'
import SpacingSection from './spacing/SpacingSection'
import style from './Controllers.module.scss'

const Controllers: React.FC = (): JSX.Element => {
  const propertys = useStoreState<Array<Property>>((state) => state.controlles.propertys)

  return (
    <Tabs orientation="vertical" colorScheme="teal" defaultIndex={propertys.length ? 0 : 1}>
      <TabList>
        <Tab p={3}>
          <Tooltip label="(F1) Already">
            <Box>
              <Icon as={BsFileCode} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(F2) Layout">
            <Box>
              <Icon as={BsLayoutTextWindowReverse} boxSize={6} />
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
              <Icon as={CgBorderRight} boxSize={6} />
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
              <Icon as={MdTransform} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(F8) Components">
            <Box>
              <Icon as={CgComponents} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(F9) Advanced">
            <Box>
              <Icon as={CgMoreAlt} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
      </TabList>
      <TabPanels className={style.panels}>
        <TabPanel>
          <ControllersContext.Provider value={{ already: true }}>
            <Already />
          </ControllersContext.Provider>
        </TabPanel>
        <TabPanel>
          <LayoutSection />
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
          <p>Components</p>
        </TabPanel>
        <TabPanel>
          <AdvancedSection />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Controllers
