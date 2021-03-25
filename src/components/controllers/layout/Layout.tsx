import React, { useState, useEffect } from 'react'
import {
  Tooltip,
  VStack,
  Checkbox,
  CheckboxGroup,
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
import type { Project } from '../../../models/project'
import type { Responsive, AlreadyVariants } from '../../../models/controlles'
import type { ContainerPropertys } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import style from './Layout.module.scss'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Layout: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <VStack className={style.layout}>
      <Variants alreadyVariants={alreadyVariants} />
    </VStack>
  )
}

export default Layout
