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
import type { AlreadyVariants } from '../../models/controlles'
import type { Project } from '../../models/project'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Layout.module.scss'
import Variants from './Variants'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Already: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <VStack className={style.layout}>
      <Variants alreadyVariants={alreadyVariants} />
      <Checkbox colorScheme="teal" checked={container.apply}>
        container
      </Checkbox>
    </VStack>
  )
}

export default Already
