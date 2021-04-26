import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Rounded from './Rounded'
import BorderWidth from './BorderWidth'
import BorderColor from './BorderColor'
import BorderOpacity from './BorderOpacity'
import BorderStyle from './BorderStyle'
import Divide from './Divide'
import DivideColor from './DivideColor'
import DivideOpacity from './DivideOpacity'
import DivideStyle from './DivideStyle'

const AdvancedSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.advanced.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <VStack mt={4} alignItems="stretch" spacing={8}>
        <Rounded />
        <BorderWidth />
        <BorderColor />
        <BorderOpacity />
        <BorderStyle />
        <Divide />
        <DivideColor />
        <DivideOpacity />
        <DivideStyle />
      </VStack>
    </>
  )
}

export default AdvancedSection
