import React, { useMemo, useContext } from 'react'
import { VStack } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Frame from './Frame'
import FrameInline from './FrameInline'
import SpaceBetween from './SpaceBetween'
import Width from './Width'
import Height from './Height'
import { ElementState } from '../../../models/element'
import { InlineDisplays } from '../../../utils/assest'

const SpacingSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.spacing.alreadyVariants)

  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const isInline = useMemo(() => InlineDisplays.some((v) => element?.actualStatus?.display === v), [element])

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}
      {isInline ? <FrameInline /> : <Frame />}

      <VStack mt={4} alignItems="stretch" spacing={4}>
        <Width />
        <Height />
        <SpaceBetween />
      </VStack>
    </>
  )
}

export default SpacingSection
