import React, { useState, useContext } from 'react'
import { Tooltip, VStack } from '@chakra-ui/react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import GridCols from './GridCols'
import GridRows from './GridRows'
import ColSpan from './ColSpan'
import ColStart from './ColStart'
import ColEnd from './ColEnd'
import RowSpan from './RowSpan'
import RowStart from './RowStart'
import RowEnd from './RowEnd'

const GridSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <GridCols />
      <GridRows />
      <ColSpan />
      <ColStart />
      <ColEnd />
      <RowSpan />
      <RowStart />
      <RowEnd />
    </VStack>
  )
}

export default GridSection
