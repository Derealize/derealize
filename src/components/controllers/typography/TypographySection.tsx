import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import FontFamily from './FontFamily'
import FontSize from './FontSize'
import FontWeight from './FontWeight'
import LineHeight from './LineHeight'
import LetterSpacing from './LetterSpacing'
import Placeholder from './Placeholder'
import Text from './Text'
import TextAlign from './TextAlign'
import TextColor from './TextColor'
import TextDecoration from './TextDecoration'
import TextOpacity from './TextOpacity'
import TextTransform from './TextTransform'

const TypographySection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.typography.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <VStack mt={4} alignItems="stretch" spacing={6}>
        <Text />
        <FontFamily />
        <FontSize />
        <FontWeight />
        <LineHeight />
        <TextAlign />
        <TextColor />
        <TextDecoration />
        <TextOpacity />
        <TextTransform />
        <LetterSpacing />
        <Placeholder />
      </VStack>
    </>
  )
}

export default TypographySection
