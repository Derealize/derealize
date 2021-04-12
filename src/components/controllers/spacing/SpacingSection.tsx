import React, { useState, useContext } from 'react'
import { Tooltip, VStack } from '@chakra-ui/react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Marging from './Marging'
import Padding from './Padding'
import SpaceBetweenY from './SpaceBetweenY'
import SpaceBetweenX from './SpaceBetweenX'
import Width from './Width'
import MaxWidth from './MaxWidth'
import MinWidth from './MinWidth'
import Height from './Height'
import MaxHeight from './MaxHeight'
import MinHeight from './MinHeight'

const SpacingSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Width />
      <MaxWidth />
      <MinWidth />
      <Height />
      <MaxHeight />
      <MinHeight />

      <Marging />
      <Padding />
      <SpaceBetweenY />
      <SpaceBetweenX />
    </VStack>
  )
}

export default SpacingSection
