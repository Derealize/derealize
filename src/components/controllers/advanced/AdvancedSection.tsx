import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import BoxSizing from './BoxSizing'
import Clear from './Clear'
import Float from './Float'
import Overscroll from './Overscroll'

type Props = {
  already?: boolean
}

const AdvancedSection: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.layout.alreadyVariants)

  return (
    <VStack alignItems="flex-start">
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      <BoxSizing already={already} />
      <Clear already={already} />
      <Float already={already} />
      <Overscroll already={already} />
    </VStack>
  )
}

AdvancedSection.defaultProps = {
  already: false,
}

export default AdvancedSection
