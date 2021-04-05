import React, { useState, useEffect } from 'react'
import { Tooltip, VStack, Box, Text, List, ListItem, ListIcon, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Marging from './Marging'
import Padding from './Padding'
import SpaceBetween from './SpaceBetween'
import Width from './Width'
import MaxWidth from './MaxWidth'
import MinWidth from './MinWidth'
import Height from './Height'
import MaxHeight from './MaxHeight'
import MinHeight from './MinHeight'

type Props = {
  already?: boolean
}

const SpacingSection: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <Width already={already} />
      <MaxWidth already={already} />
      <MinWidth already={already} />
      <Height already={already} />
      <MaxHeight already={already} />
      <MinHeight already={already} />

      <Marging already={already} />
      <Padding already={already} />
      <SpaceBetween already={already} />
    </VStack>
  )
}

SpacingSection.defaultProps = {
  already: false,
}

export default SpacingSection
