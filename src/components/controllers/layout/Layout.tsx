import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, List, ListItem, ListIcon, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Container from './Container'
import BoxSizing from './BoxSizing'
import Variants from '../Variants'
import style from './Layout.module.scss'

const Layout: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack className={style.layout}>
      <Variants alreadyVariants={alreadyVariants} />
      <Container />
      <BoxSizing />
    </VStack>
  )
}

export default Layout
