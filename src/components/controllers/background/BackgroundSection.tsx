import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import BackgroundAttachment from './BackgroundAttachment'
import BackgroundClip from './BackgroundClip'
import BackgroundColor from './BackgroundColor'
import BackgroundImage from './BackgroundImage'
import BackgroundOpacity from './BackgroundOpacity'
import BackgroundPosition from './BackgroundPosition'
import BackgroundRepeat from './BackgroundRepeat'
import BackgroundSize from './BackgroundSize'

const BackgroundSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.typography.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <VStack mt={4} alignItems="stretch">
        <BackgroundColor />
        <BackgroundImage />
        <BackgroundOpacity />

        <BackgroundPosition />
        <BackgroundRepeat />
        <BackgroundSize />
        <BackgroundAttachment />
        <BackgroundClip />
      </VStack>
    </>
  )
}

export default BackgroundSection
