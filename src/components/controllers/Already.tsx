import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../models/controlles'
import type { Project } from '../../models/project'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Already.module.scss'
import Variants from './Variants'
import LayoutSection from './layout/LayoutSection'
import FlexSection from './flex/FlexSection'

type Props = {
  project: Project
}

const Already: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)

  return (
    <VStack className={style.layout}>
      <Variants alreadyVariants={alreadyVariants} />
      <LayoutSection already />
      <FlexSection already />
    </VStack>
  )
}

export default Already
