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
import Divide from './Divide'

const BorderSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.border.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <VStack mt={4} alignItems="stretch" spacing={8}>
        <BoxSizing />
        <Clear />
        <Float />
        <Divide />
        <Overscroll />
      </VStack>
    </>
  )
}

export default BorderSection
