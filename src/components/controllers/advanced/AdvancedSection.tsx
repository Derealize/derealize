import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'

import Overscroll from './Overscroll'
import Divide from './Divide'
import FontSmoothing from './FontSmoothing'
import FontStyle from './FontStyle'
import FontVariantNumeric from './FontVariantNumeric'
import ListStyle from './ListStyle'
import TextOverflow from './TextOverflow'
import VerticalAlign from './VerticalAlign'
import WordBreak from './WordBreak'

const BorderSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.border.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <VStack mt={4} alignItems="stretch" spacing={4}>
        <Divide />
        <Overscroll />
        <FontSmoothing />
        <FontStyle />
        <FontVariantNumeric />
        <ListStyle />
        <TextOverflow />
        <VerticalAlign />
        <WordBreak />
      </VStack>
    </>
  )
}

export default BorderSection
