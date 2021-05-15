import React, { useState, useEffect } from 'react'
import { Select, VStack, Box, Text, Icon } from '@chakra-ui/react'
import type { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import Variants from './Variants'
import ElementEdit from './ElementEdit'

import Container from './layout/Container'
import Display from './layout/Display'
import ObjectFit from './layout/ObjectFit'
import ObjectPosition from './layout/ObjectPosition'
import Overflow from './layout/Overflow'
import Position from './layout/Position'
import Inset from './layout/Inset'
import Visibility from './layout/Visibility'
import Zindex from './layout/Zindex'
import BoxSizing from './layout/BoxSizing'
import Clear from './layout/Clear'
import Float from './layout/Float'

import FlexController from './flex/Flex'
import FlexDirection from './flex/FlexDirection'
import FlexGrow from './flex/FlexGrow'
import FlexShrink from './flex/FlexShrink'
import FlexWrap from './flex/FlexWrap'
import JustifyContent from './flex/JustifyContent'
import Order from './flex/Order'
import AlignContent from './flex/AlignContent'
import AlignItems from './flex/AlignItems'
import AlignSelf from './flex/AlignSelf'

import GridCols from './grid/GridCols'
import GridRows from './grid/GridRows'
import Gap from './grid/Gap'
import GridFlow from './grid/GridFlow'
import ColSpan from './grid/ColSpan'
import ColStart from './grid/ColStart'
import ColEnd from './grid/ColEnd'
import RowSpan from './grid/RowSpan'
import RowStart from './grid/RowStart'
import RowEnd from './grid/RowEnd'
import AutoCols from './grid/AutoCols'
import AutoRows from './grid/AutoRows'

import Frame from './spacing/Frame'
import SpaceBetween from './spacing/SpaceBetween'
import Width from './spacing/Width'
import Height from './spacing/Height'

const AlreadySection: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <VStack alignItems="stretch">
      <Variants alreadyVariants={alreadyVariants} />
      <Display />

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

      <Position />
      <Inset />

      <Float />
      <Clear />

      <Visibility />
      <Zindex />
      <BoxSizing />
      <Container />
      <ObjectFit />
      <ObjectPosition />
      <Overflow />

      <Frame />
      <Width />
      <Height />
      <SpaceBetween />

      <ElementEdit />
    </VStack>
  )
}

export default AlreadySection
