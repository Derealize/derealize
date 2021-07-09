import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Flex, Icon } from '@chakra-ui/react'
import { IoLink, IoUnlink } from 'react-icons/io5'
import { HiOutlineExternalLink } from 'react-icons/hi'
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
        <Box w="50%">
          <SelectController
            placeholder="top-left"
            values={bind ? roundedValues : roundedTopLeftValues}
            property={roundedTopLeftProperty || roundedProperty}
            doclink={false}
          />
        </Box>
        <Box w="50%">
          <SelectController
            placeholder="top-right"
            values={bind ? roundedValues : roundedTopRightValues}
            property={roundedTopRightProperty || roundedProperty}
            doclink={false}
          />
        </Box>
      </Flex>
      <Center>
        {bind ? (
          <Icon
            as={IoLink}
            w={6}
            h={6}
            color="teal.500"
            _hover={{ color: 'gray.600', cursor: 'pointer' }}
            onClick={() => setBind(false)}
          />
        ) : (
          <Icon
            as={IoUnlink}
            w={6}
            h={6}
            color="gray.400"
            _hover={{ color: 'gray.600', cursor: 'pointer' }}
            onClick={() => setBind(true)}
          />
        )}
        <a href="https://tailwindcss.com/docs/border-radius" target="_black" style={{ lineHeight: '12px' }}>
          <Icon as={HiOutlineExternalLink} ml={1} boxSize={4} color="gray.300" _hover={{ color: 'gray.500' }} />
        </a>
      </Center>
      <Flex justifyContent="space-between">
        <Box w="50%">
          <SelectController
            placeholder="bot-left"
            values={bind ? roundedValues : roundedBottomLeftValues}
            property={roundedBottomLeftProperty || roundedProperty}
            doclink={false}
          />
        </Box>
        <Box w="50%">
          <SelectController
            placeholder="bot-right"
            values={bind ? roundedValues : roundedBottomRightValues}
            property={roundedBottomRightProperty || roundedProperty}
            doclink={false}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Rounded
