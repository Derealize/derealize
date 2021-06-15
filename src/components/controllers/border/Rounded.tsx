import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Flex, Icon } from '@chakra-ui/react'
import { IoLink, IoUnlink } from 'react-icons/io5'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const Rounded: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const [bind, setBind] = useState(false)

  const roundedValues = useStoreState<Array<string>>((state) => state.border.roundedValues)
  const roundedPropertys = useStoreState<Array<Property>>((state) => state.border.roundedPropertys)
  const roundedProperty = useComputeProperty(roundedPropertys)

  const roundedTopLeftValues = useStoreState<Array<string>>((state) => state.border.roundedTopLeftValues)
  const roundedTopLeftPropertys = useStoreState<Array<Property>>((state) => state.border.roundedTopLeftPropertys)
  const roundedTopLeftProperty = useComputeProperty(roundedTopLeftPropertys)

  const roundedTopRightValues = useStoreState<Array<string>>((state) => state.border.roundedTopRightValues)
  const roundedTopRightPropertys = useStoreState<Array<Property>>((state) => state.border.roundedTopRightPropertys)
  const roundedTopRightProperty = useComputeProperty(roundedTopRightPropertys)

  const roundedBottomLeftValues = useStoreState<Array<string>>((state) => state.border.roundedBottomLeftValues)
  const roundedBottomLeftPropertys = useStoreState<Array<Property>>((state) => state.border.roundedBottomLeftPropertys)
  const roundedBottomLeftProperty = useComputeProperty(roundedBottomLeftPropertys)

  const roundedBottomRightValues = useStoreState<Array<string>>((state) => state.border.roundedBottomRightValues)
  const roundedBottomRightPropertys = useStoreState<Array<Property>>(
    (state) => state.border.roundedBottomRightPropertys,
  )
  const roundedBottomRightProperty = useComputeProperty(roundedBottomRightPropertys)

  if (
    already &&
    !roundedProperty &&
    !roundedTopLeftProperty &&
    !roundedTopRightProperty &&
    !roundedBottomLeftProperty &&
    !roundedBottomRightProperty
  )
    return <></>

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Box w="52%">
          <SelectController
            placeholder={bind ? 'radius' : 'radius-tl'}
            values={bind ? roundedValues : roundedTopLeftValues}
            property={bind ? roundedProperty : roundedTopLeftProperty}
            doclink="border-radius"
          />
        </Box>
        <Box w="46%">
          <SelectController
            placeholder={bind ? 'radius' : 'radius-tr'}
            values={bind ? roundedValues : roundedTopRightValues}
            property={bind ? roundedProperty : roundedTopRightProperty}
            doclink={false}
          />
        </Box>
      </Flex>
      <Center>
        {bind ? (
          <Icon as={IoLink} w={6} h={6} color="gray.600" onClick={() => setBind(false)} />
        ) : (
          <Icon as={IoUnlink} w={6} h={6} color="gray.400" onClick={() => setBind(true)} />
        )}
      </Center>
      <Flex justifyContent="space-between">
        <Box w="46%">
          <SelectController
            placeholder={bind ? 'radius' : 'radius-bl'}
            values={bind ? roundedValues : roundedBottomLeftValues}
            property={bind ? roundedProperty : roundedBottomLeftProperty}
            doclink={false}
          />
        </Box>
        <Box w="46%">
          <SelectController
            placeholder={bind ? 'radius' : 'radius-br'}
            values={bind ? roundedValues : roundedBottomRightValues}
            property={bind ? roundedProperty : roundedBottomRightProperty}
            doclink={false}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Rounded
