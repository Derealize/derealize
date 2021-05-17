import React, { useContext } from 'react'
import { HStack, Center, Box } from '@chakra-ui/react'
import type { Property } from '../../../models/controlles/controlles'
import ControllersContext from '../ControllersContext'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

export const InsetPositions = ['fixed', 'absolute', 'relative', 'sticky']

const Inset: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

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

  if (already && !propertyTop && !propertyBottom && !propertyLeft && !propertyRight) return <></>
  if (!InsetPositions.some((name) => element?.actualStatus?.position.includes(name))) return <></>

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
