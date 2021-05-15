import React, { useState, useContext } from 'react'
import { nanoid } from 'nanoid'
import Switch from 'react-switch'
import {
  VStack,
  HStack,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
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
import BoxSizing from './BoxSizing'

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

import Clear from './Clear'
import Float from './Float'
import Overscroll from './Overscroll'

import theme from '../../../theme'

const LayoutSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)

  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.project.deleteActiveElementProperty)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}

      <VStack mt={4} alignItems="stretch">
        <Display />
      </VStack>

      <Accordion mt={4}>
        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Flex
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <HStack align="center" justify="space-between" px={1} py={2}>
              <span>enable</span>
              <Switch
                checked={displayProperty?.classname === 'flex'}
                onChange={(check) => {
                  if (check) {
                    if (displayProperty) {
                      setProperty({ propertyId: displayProperty.id, classname: 'flex' })
                    } else {
                      setProperty({ propertyId: nanoid(), classname: 'flex' })
                    }
                  } else if (displayProperty) {
                    deleteProperty(displayProperty.id)
                  }
                  liveApplyClassName()
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
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Grid
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <HStack align="center" justify="space-between" px={1} py={2}>
              <span>enable</span>
              <Switch
                checked={displayProperty?.classname === 'grid'}
                onChange={(check) => {
                  if (check) {
                    if (displayProperty) {
                      setProperty({ propertyId: displayProperty.id, classname: 'grid' })
                    } else {
                      setProperty({ propertyId: nanoid(), classname: 'grid' })
                    }
                  } else if (displayProperty) {
                    deleteProperty(displayProperty.id)
                  }
                  liveApplyClassName()
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
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Position
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Position />
            <Inset />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Float
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Float />
            <Clear />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Advanced
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Visibility />
            <Zindex />
            <BoxSizing />
            <Container />
            <ObjectFit />
            <ObjectPosition />
            <Overflow />
            <Overscroll />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

LayoutSection.defaultProps = {
  already: false,
}

export default LayoutSection
