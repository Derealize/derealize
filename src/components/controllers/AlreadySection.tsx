import React, { useState, useEffect } from 'react'
import { Select, VStack, Box, Icon } from '@chakra-ui/react'
import type { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import ControllersContext from './ControllersContext'
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

import GridCols from './grid/TemplateCols'
import GridRows from './grid/TemplateRows'
import Gap from './grid/Gap'
import GridFlow from './grid/AutoFlow'
import ColSpan from './grid/ColSpan'
import ColStart from './grid/ColStart'
import ColEnd from './grid/ColEnd'
import RowSpan from './grid/RowSpan'
import RowStart from './grid/RowStart'
import RowEnd from './grid/RowEnd'
import AutoCols from './grid/AutoCols'
import AutoRows from './grid/AutoRows'

import SpacingSection from './spacing/SpacingSection'

import Rounded from './border/Rounded'
import Border from './border/Border'
import Divide from './border/Divide'

import FontFamily from './typography/FontFamily'
import FontSize from './typography/FontSize'
import FontWeight from './typography/FontWeight'
import LineHeight from './typography/LineHeight'
import LetterSpacing from './typography/LetterSpacing'
import Placeholder from './typography/Placeholder'
import Text from './typography/Text'
import TextAlign from './typography/TextAlign'
import TextColor from './typography/TextColor'
import TextDecoration from './typography/TextDecoration'
import TextOpacity from './typography/TextOpacity'
import TextTransform from './typography/TextTransform'
import FontSmoothing from './typography/FontSmoothing'
import FontStyle from './typography/FontStyle'
import FontVariantNumeric from './typography/FontVariantNumeric'
import ListStyle from './typography/ListStyle'
import TextOverflow from './typography/TextOverflow'
import VerticalAlign from './typography/VerticalAlign'
import WordBreak from './typography/WordBreak'

import BackgroundSection from './background/BackgroundSection'

import BoxShadow from './effects/BoxShadow'
import Opacity from './effects/Opacity'
import Transition from './effects/Transition'
import Animation from './effects/Animation'
import Transform from './effects/Transform'
import MixBlend from './effects/MixBlend'
import BackgroundBlend from './effects/BackgroundBlend'

const AlreadySection: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <ControllersContext.Provider value={{ already: true }}>
      <VStack alignItems="stretch">
        <Variants alreadyVariants={alreadyVariants} />

        <ElementEdit />
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

        <SpacingSection />

        <Border />
        <Rounded />
        <Divide />

        <FontFamily />
        <FontSize />
        <FontWeight />
        <LineHeight />
        <LetterSpacing />
        <Placeholder />
        <Text />
        <TextAlign />
        <TextColor />
        <TextDecoration />
        <TextOpacity />
        <TextTransform />

        <FontSmoothing />
        <FontStyle />
        <FontVariantNumeric />
        <ListStyle />
        <TextOverflow />
        <VerticalAlign />
        <WordBreak />

        <BackgroundSection />

        <BoxShadow />
        <Opacity />
        <Transition />
        <Animation />
        <Transform />
        <MixBlend />
        <BackgroundBlend />
      </VStack>
    </ControllersContext.Provider>
  )
}

export default AlreadySection
