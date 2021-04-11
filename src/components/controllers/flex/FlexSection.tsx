import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, List, ListItem, ListIcon, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
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

type Props = {
  already?: boolean
}

const FlexSection: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Flex already={already} />
      <FlexDirection already={already} />
      <FlexGrow already={already} />
      <FlexShrink already={already} />
      <FlexWrap already={already} />
      <JustifyContent already={already} />
      <Order already={already} />
      <AlignContent already={already} />
      <AlignItems already={already} />
      <AlignSelf already={already} />
    </VStack>
  )
}

FlexSection.defaultProps = {
  already: false,
}

export default FlexSection
