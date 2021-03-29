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

type Props = {
  already?: boolean
}

const LayoutSection: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Container already={already} />
      <BoxSizing already={already} />
      <Clear already={already} />
      <Display already={already} />
      <Float already={already} />
      <ObjectFit already={already} />
      <ObjectPosition already={already} />
      <Overflow already={already} />
      <Overscroll already={already} />
      <Position already={already} />
      <Visibility already={already} />
      <Zindex already={already} />
    </VStack>
  )
}

LayoutSection.defaultProps = {
  already: false,
}

export default LayoutSection
