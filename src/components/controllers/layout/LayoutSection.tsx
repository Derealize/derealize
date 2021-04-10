import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Container from './Container'
import Display from './Display'
import ObjectFit from './ObjectFit'
import ObjectPosition from './ObjectPosition'
import Overflow from './Overflow'
import Position from './Position'
import Visibility from './Visibility'
import Zindex from './Zindex'

type Props = {
  already?: boolean
}

const LayoutSection: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Container already={already} />
      <Display already={already} />
      <ObjectFit already={already} />
      <ObjectPosition already={already} />
      <Overflow already={already} />
      <Position already={already} />
      <Visibility already={already} />
      <Zindex already={already} />
    </VStack>
  )
}

LayoutSection.defaultProps = {
  already: false,
}

export default LayoutSection
