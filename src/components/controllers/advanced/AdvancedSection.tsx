import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import BoxSizing from './BoxSizing'
import Clear from './Clear'
import Float from './Float'
import Overscroll from './Overscroll'

const AdvancedSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.advanced.alreadyVariants)

  return (
    <VStack alignItems="stretch">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <BoxSizing />
      <Clear />
      <Float />
      <Overscroll />
    </VStack>
  )
}

export default AdvancedSection
