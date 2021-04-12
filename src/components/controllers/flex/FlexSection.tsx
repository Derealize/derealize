import React, { useState, useContext } from 'react'
import { Tooltip, VStack } from '@chakra-ui/react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
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

const FlexSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
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
