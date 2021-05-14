import React, { useState, useContext } from 'react'
import { VStack, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import type { AlreadyVariants, Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import ControllersContext from '../ControllersContext'

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

const LayoutSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}

      <VStack mt={4} alignItems="stretch">
        <Display />
      </VStack>

      <Accordion defaultIndex={[0]} mt={4}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Flex
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel alignItems="stretch" pb={4}>
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
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Grid
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel alignItems="stretch" pb={4}>
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
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Position
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel alignItems="stretch" pb={4}>
            <Position />
            <Inset />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Float
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel alignItems="stretch" pb={4}>
            <Float />
            <Clear />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Advanced
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel alignItems="stretch" pb={4}>
            <Visibility />
            <Zindex />
            <BoxSizing />
            <Container />
            <ObjectFit />
            <ObjectPosition />
            <Overflow />
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
