import React, { useState, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import type { AlreadyVariants, Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import ControllersContext from '../ControllersContext'
import useComputeProperty from '../useComputeProperty'

import Variants from '../Variants'
import Container from './Container'
import Display from './Display'
import ObjectFit from './ObjectFit'
import ObjectPosition from './ObjectPosition'
import Overflow from './Overflow'
import Position from './Position'
import Inset from './Inset'
import Visibility from './Visibility'
import Zindex from './Zindex'

import FlexController from '../flex/Flex'
import FlexDirection from '../flex/FlexDirection'
import FlexGrow from '../flex/FlexGrow'
import FlexShrink from '../flex/FlexShrink'
import FlexWrap from '../flex/FlexWrap'
import JustifyContent from '../flex/JustifyContent'
import Order from '../flex/Order'
import AlignContent from '../flex/AlignContent'
import AlignItems from '../flex/AlignItems'
import AlignSelf from '../flex/AlignSelf'

import GridCols from '../grid/GridCols'
import GridRows from '../grid/GridRows'
import Gap from '../grid/Gap'
import GridFlow from '../grid/GridFlow'
import ColSpan from '../grid/ColSpan'
import ColStart from '../grid/ColStart'
import ColEnd from '../grid/ColEnd'
import RowSpan from '../grid/RowSpan'
import RowStart from '../grid/RowStart'
import RowEnd from '../grid/RowEnd'
import AutoCols from '../grid/AutoCols'
import AutoRows from '../grid/AutoRows'

const LayoutSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)
  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)
  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}

      <VStack mt={4} alignItems="stretch">
        <Display />
      </VStack>

      {displayProperty?.classname === 'flex' && (
        <VStack mt={2} alignItems="stretch">
          <FlexController />
          <FlexDirection />
          <FlexGrow />
          <FlexShrink />
          <FlexWrap />
          <JustifyContent />
          <Order />
          <AlignContent />
          <AlignItems />
          <AlignSelf />
        </VStack>
      )}

      {displayProperty?.classname === 'grid' && (
        <VStack mt={2} alignItems="stretch">
          <GridCols />
          <GridRows />
          <Gap />
          <GridFlow />
          <ColSpan />
          <ColStart />
          <ColEnd />
          <RowSpan />
          <RowStart />
          <RowEnd />
          <AutoCols />
          <AutoRows />
        </VStack>
      )}

      <VStack mt={4} alignItems="stretch">
        <Position />
        <Inset />
        <Container />
        <ObjectFit />
        <ObjectPosition />
        <Overflow />
        <Visibility />
        <Zindex />
      </VStack>
    </>
  )
}

LayoutSection.defaultProps = {
  already: false,
}

export default LayoutSection
