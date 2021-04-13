import React, { useState, useContext } from 'react'
import { VStack, HStack, Stack } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import Switch from 'react-switch'
import type { AlreadyVariants, Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import ControllersContext from '../ControllersContext'
import useComputeProperty from '../useComputeProperty'
import theme from '../../../theme'

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

  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)
  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)

  return (
    <VStack alignItems="stretch">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <HStack align="center" justify="space-between">
        <span>Flex</span>
        <Switch
          checked={displayProperty?.classname === 'flex'}
          onChange={(check) => {
            if (check) {
              if (displayProperty) {
                displayProperty.classname = 'flex'
                setProperty(displayProperty)
              } else {
                setProperty({
                  id: nanoid(),
                  classname: 'flex',
                } as Property)
              }
            } else if (displayProperty) {
              deleteProperty(displayProperty.id)
            }
            updateClassName(true)
          }}
          offColor={theme.colors.gray['300']}
          onColor={theme.colors.gray['300']}
          onHandleColor={theme.colors.teal['400']}
          offHandleColor={theme.colors.gray['400']}
          handleDiameter={26}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 6px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
        />
      </HStack>

      <HStack align="center" justify="space-between">
        <span>Grid</span>
        <Switch
          checked={displayProperty?.classname === 'grid'}
          onChange={(check) => {
            if (check) {
              if (displayProperty) {
                displayProperty.classname = 'grid'
                setProperty(displayProperty)
              } else {
                setProperty({
                  id: nanoid(),
                  classname: 'grid',
                } as Property)
              }
            } else if (displayProperty) {
              deleteProperty(displayProperty.id)
            }
            updateClassName(true)
          }}
          offColor={theme.colors.gray['300']}
          onColor={theme.colors.gray['300']}
          onHandleColor={theme.colors.teal['400']}
          offHandleColor={theme.colors.gray['400']}
          handleDiameter={26}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 6px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
        />
      </HStack>

      <Display />

      {displayProperty?.classname === 'flex' && (
        <>
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
        </>
      )}

      {displayProperty?.classname === 'grid' && (
        <>
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
        </>
      )}

      <Position />
      <Inset />
      <Container />
      <ObjectFit />
      <ObjectPosition />
      <Overflow />
      <Visibility />
      <Zindex />
    </VStack>
  )
}

LayoutSection.defaultProps = {
  already: false,
}

export default LayoutSection
