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
import type { Project } from '../../models/project'
import type { Responsive, ElementState } from '../../models/controlles'
import type { ContainerPropertys } from '../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Layout.module.scss'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Layout: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const responsive = useStoreState<Responsive>((state) => state.controlles.responsive)
  const container = useStoreState<ContainerPropertys>((state) => state.layout.container)

  return (
    <VStack className={style.layout}>
      <Checkbox colorScheme="teal" checked={container.apply}>
        container
      </Checkbox>
    </VStack>
  )
}

export default Layout
