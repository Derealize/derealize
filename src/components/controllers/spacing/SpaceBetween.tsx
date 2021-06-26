import React, { useMemo, useState, useContext } from 'react'
import { HStack, Box } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'
import { InlineDisplays } from '../../../utils/assest'

const SpaceBetween: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.spaceXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.spaceXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.spaceYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.spaceYPropertys)
  const propertyY = useComputeProperty(propertysY)

  if (already && !propertyX && !propertyY) return <></>
  if (InlineDisplays.some((v) => element?.actualStatus?.display === v)) return <></>

  return (
    <HStack>
      <SelectController placeholder="space-x" values={valuesX} property={propertyX} doclink="space" />
      <SelectController placeholder="space-y" values={valuesY} property={propertyY} doclink="space" />
    </HStack>
  )
}

export default SpaceBetween
