import React, { useState, useEffect } from 'react'
import type { IpcRendererEvent } from 'electron'
import { Tooltip, Stack, Box, Tabs, TabList, Tab, TabPanels, TabPanel, Icon } from '@chakra-ui/react'
import { IoImageOutline, IoGridOutline } from 'react-icons/io5'
import { BsType, BsLayoutTextWindowReverse, BsFileCode, BsTextareaT, BsListCheck } from 'react-icons/bs'
import { AiOutlineAlignCenter, AiOutlineInteraction, AiOutlineLayout } from 'react-icons/ai'
import { CgSpaceBetweenV, CgComponents, CgMoreAlt, CgBorderRight, CgRatio, CgFormatText } from 'react-icons/cg'
import { RiFileList2Line, RiLayoutMasonryLine, RiLayoutGridLine, RiLayout5Line, RiImageLine } from 'react-icons/ri'
import { MdTransform, MdGridOn, MdFormatColorText } from 'react-icons/md'
import { FcAddRow } from 'react-icons/fc'
import { BiCrop } from 'react-icons/bi'
import { useStoreActions, useStoreState } from '../../reduxStore'
import ControllersContext from './ControllersContext'
import type { Property } from '../../models/controlles/controlles'
import AlreadySection from './AlreadySection'
import AdvancedSection from './advanced/AdvancedSection'
import LayoutSection from './layout/LayoutSection'
import SpacingSection from './spacing/SpacingSection'
import BorderSection from './border/BorderSection'
import TypographySection from './typography/TypographySection'
import BackgroundSection from './background/BackgroundSection'
import EffectsSection from './effects/EffectsSection'
import InsertSection from './InsertSection'
import { ElementPayload, MainIpcChannel } from '../../interface'
import style from './Controllers.module.scss'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow
const { listenMainIpc, unlistenMainIpc } = window.derealize

enum ControllerTab {
  Already,
  Layout,
  Spacing,
  Border,
  Typography,
  Background,
  Effects,
  Components,
  Advanced,
  Insert,
}

const Controllers: React.FC = (): JSX.Element => {
  const propertys = useStoreState<Array<Property>>((state) => state.controlles.propertys)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)
  const [tabIndex, setTabIndex] = useState(propertys.length ? ControllerTab.Already : ControllerTab.Layout)

  useEffect(() => {
    listenMainIpc(MainIpcChannel.InsertTab, (e: IpcRendererEvent, payload: boolean) => {
      if (payload) {
        setTabIndex(ControllerTab.Insert)
      }
    })

    if (tabIndex === ControllerTab.Typography && element?.text === undefined) {
      setTabIndex(ControllerTab.Already)
    }

    listenMainIpc(MainIpcChannel.TextTab, (e: IpcRendererEvent, payload: boolean) => {
      if (payload && element?.text !== undefined) {
        setTabIndex(ControllerTab.Typography)
      }
    })

    listenMainIpc(MainIpcChannel.ControllerShortcut, (e: IpcRendererEvent, key: string) => {
      if (key.startsWith('Alt+')) {
        const number = key.split('+').splice(-1)[0]
        setTabIndex((parseInt(number, 10) - 1) as ControllerTab)
      }
    })

    return () => {
      unlistenMainIpc(MainIpcChannel.InsertTab)
      unlistenMainIpc(MainIpcChannel.TextTab)
      unlistenMainIpc(MainIpcChannel.ControllerShortcut)
    }
  }, [element, tabIndex])

  return (
    <Tabs orientation="vertical" colorScheme="teal" index={tabIndex} onChange={(i) => setTabIndex(i)}>
      <TabList>
        <Tab p={3}>
          <Tooltip label="(Alt+1) Current">
            <Box>
              <Icon as={BsListCheck} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+2) Layout">
            <Box>
              <Icon as={AiOutlineLayout} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+3) Spacing">
            <Box>
              <Icon as={CgRatio} boxSize={5} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab px={2} py={3}>
          <Tooltip label="(Alt+4) Border">
            <Box>
              <Icon as={CgBorderRight} boxSize={7} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+5) Typography">
            <Box>
              <Icon as={MdFormatColorText} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+6) Background">
            <Box>
              <Icon as={RiImageLine} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+7) Effects/Transition/Transform">
            <Box>
              <Icon as={BiCrop} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+8) Components">
            <Box>
              <Icon as={CgComponents} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+9) Advanced">
            <Box>
              <Icon as={CgMoreAlt} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
        <Tab p={3}>
          <Tooltip label="(Alt+10) Add">
            <Box>
              <Icon as={FcAddRow} boxSize={6} />
            </Box>
          </Tooltip>
        </Tab>
      </TabList>
      <TabPanels className={style.panels}>
        <TabPanel>
          <ControllersContext.Provider value={{ already: true }}>
            <AlreadySection />
          </ControllersContext.Provider>
        </TabPanel>
        <TabPanel>
          <LayoutSection />
        </TabPanel>
        <TabPanel>
          <SpacingSection />
        </TabPanel>
        <TabPanel>
          <BorderSection />
        </TabPanel>
        <TabPanel>
          <TypographySection />
        </TabPanel>
        <TabPanel>
          <BackgroundSection />
        </TabPanel>
        <TabPanel>
          <EffectsSection />
        </TabPanel>
        <TabPanel>
          <p>Components</p>
        </TabPanel>
        <TabPanel>
          <AdvancedSection />
        </TabPanel>
        <TabPanel>
          <InsertSection />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Controllers
