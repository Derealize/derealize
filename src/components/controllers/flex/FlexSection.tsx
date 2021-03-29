import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, List, ListItem, ListIcon, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Flex from './Flex'
import FlexDirection from './FlexDirection'
import FlexGrow from './FlexGrow'
import FlexShrink from './FlexShrink'
import FlexWrap from './FlexWrap'
import JustifyContent from './JustifyContent'
import Order from './Order'
import AlignContent from './AlignContent'
import AlignItems from './AlignItems'
import AlignSelf from './AlignSelf'

const FlexSection: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.flex.alreadyVariants)

  return (
    <VStack>
      <Variants alreadyVariants={alreadyVariants} />
      <Flex />
      <FlexDirection />
      <FlexGrow />
      <FlexShrink />
      <FlexWrap />
      <JustifyContent />
      <Order />
      <AlignContent />
      <AlignItems />
      <AlignSelf />
    </VStack>
  )
}

export default FlexSection
