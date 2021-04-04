import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Already.module.scss'
import Variants from './Variants'
import LayoutSection from './layout/LayoutSection'
import FlexSection from './flex/FlexSection'
import SizeSection from './size/SizeSection'
import SpacingSection from './spacing/SpacingSection'

const Already: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <VStack className={style.already}>
      <Variants alreadyVariants={alreadyVariants} />
      <LayoutSection already />
      <FlexSection already />
      <SizeSection already />
      <SpacingSection already />
    </VStack>
  )
}

export default Already
