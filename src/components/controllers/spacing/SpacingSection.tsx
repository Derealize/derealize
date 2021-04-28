import React, { useState, useContext } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Frame from './Frame'
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
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.spacing.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Frame />

      <VStack mt={4} alignItems="stretch" spacing={4}>
        <Width />
        <MaxWidth />
        <MinWidth />
        <Height />
        <MaxHeight />
        <MinHeight />
        <SpaceBetweenY />
        <SpaceBetweenX />
      </VStack>
    </>
  )
}

export default SpacingSection
