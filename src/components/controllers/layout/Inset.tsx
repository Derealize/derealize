import React from 'react'
import { HStack, Center } from '@chakra-ui/react'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

export const InsetPositions = ['fixed', 'absolute', 'relative', 'sticky']

const Inset: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const positionPropertys = useStoreState<Array<Property>>((state) => state.layout.positionPropertys)
  const positionProperty = useComputeProperty(positionPropertys)

  const valuesTop = useStoreState<Array<string>>((state) => state.layout.topValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.layout.topPropertys)
  const propertyTop = useComputeProperty(propertysTop)

  const valuesBottom = useStoreState<Array<string>>((state) => state.layout.bottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.layout.bottomPropertys)
  const propertyBottom = useComputeProperty(propertysBottom)

  const valuesLeft = useStoreState<Array<string>>((state) => state.layout.leftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.layout.leftPropertys)
  const propertyLeft = useComputeProperty(propertysLeft)

  const valuesRight = useStoreState<Array<string>>((state) => state.layout.rightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.layout.rightPropertys)
  const propertyRight = useComputeProperty(propertysRight)

  console.log('positionProperty.classname', positionProperty?.classname)
  if (!positionProperty || !InsetPositions.includes(positionProperty.classname)) return <></>

  return (
    <>
      <Center w="50%">
        <SelectController placeholder="inset-top" values={valuesTop} property={propertyTop} />
      </Center>
      <HStack>
        <SelectController placeholder="inset-left" values={valuesLeft} property={propertyLeft} />
        <SelectController placeholder="inset-right" values={valuesRight} property={propertyRight} />
      </HStack>
      <Center w="50%">
        <SelectController placeholder="inset-bottom" values={valuesBottom} property={propertyBottom} />
      </Center>
    </>
  )
}

export default Inset
