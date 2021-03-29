import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, List, ListItem, ListIcon, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Container from './Container'
import BoxSizing from './BoxSizing'
import Clear from './Clear'
import Display from './Display'
import Float from './Float'
import ObjectFit from './ObjectFit'
import ObjectPosition from './ObjectPosition'
import Overflow from './Overflow'
import Overscroll from './Overscroll'
import Position from './Position'
import Visibility from './Visibility'
import Zindex from './Zindex'

const LayoutSection: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack>
      <Variants alreadyVariants={alreadyVariants} />
      <Container />
      <BoxSizing />
      <Clear />
      <Display />
      <Float />
      <ObjectFit />
      <ObjectPosition />
      <Overflow />
      <Overscroll />
      <Position />
      <Visibility />
      <Zindex />
    </VStack>
  )
}

export default LayoutSection
