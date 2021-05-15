import React, { useState, useContext } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Frame from './Frame'
import SpaceBetween from './SpaceBetween'
import Width from './Width'
import Height from './Height'

const SpacingSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.spacing.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Frame />

      <VStack mt={4} alignItems="stretch" spacing={4}>
        <Width />
        <Height />
        <SpaceBetween />
      </VStack>
    </>
  )
}

export default SpacingSection
