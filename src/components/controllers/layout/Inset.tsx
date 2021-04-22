import React from 'react'
import { HStack, Center, Box } from '@chakra-ui/react'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

export const InsetPositions = ['fixed', 'absolute', 'relative', 'sticky']

const Inset: React.FC = (): JSX.Element => {
  // const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)
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

  if (!positionProperty || !InsetPositions.includes(positionProperty.classname)) return <></>
  // if (!element?.position || !InsetPositions.includes(element.position)) return <></>

  return (
    <>
      <Center>
        <Box w="50%">
          <SelectController placeholder="top" values={valuesTop} property={propertyTop} />
        </Box>
      </Center>
      <HStack>
        <SelectController placeholder="left" values={valuesLeft} property={propertyLeft} />
        <SelectController placeholder="right" values={valuesRight} property={propertyRight} />
      </HStack>
      <Center>
        <Box w="50%">
          <SelectController placeholder="bottom" values={valuesBottom} property={propertyBottom} />
        </Box>
      </Center>
    </>
  )
}

export default Inset
