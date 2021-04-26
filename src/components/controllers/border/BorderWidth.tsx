import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Text, Icon } from '@chakra-ui/react'
import { IoLink, IoUnlink } from 'react-icons/io5'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const BorderWidth: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const [bind, setBind] = useState(false)

  const borderValues = useStoreState<Array<string>>((state) => state.border.borderValues)
  const borderPropertys = useStoreState<Array<Property>>((state) => state.border.borderPropertys)
  const borderProperty = useComputeProperty(borderPropertys)

  const borderTopValues = useStoreState<Array<string>>((state) => state.border.borderTopValues)
  const borderTopPropertys = useStoreState<Array<Property>>((state) => state.border.borderTopPropertys)
  const borderTopProperty = useComputeProperty(borderTopPropertys)

  const borderBottomValues = useStoreState<Array<string>>((state) => state.border.borderBottomValues)
  const borderBottomPropertys = useStoreState<Array<Property>>((state) => state.border.borderBottomPropertys)
  const borderBottomProperty = useComputeProperty(borderBottomPropertys)

  const borderLeftValues = useStoreState<Array<string>>((state) => state.border.borderLeftValues)
  const borderLeftPropertys = useStoreState<Array<Property>>((state) => state.border.borderLeftPropertys)
  const borderLeftProperty = useComputeProperty(borderLeftPropertys)

  const borderRightValues = useStoreState<Array<string>>((state) => state.border.borderRightValues)
  const borderRightPropertys = useStoreState<Array<Property>>((state) => state.border.borderRightPropertys)
  const borderRightProperty = useComputeProperty(borderRightPropertys)

  if (
    already &&
    !borderProperty &&
    !borderTopProperty &&
    !borderBottomProperty &&
    !borderLeftProperty &&
    !borderRightProperty
  )
    return <></>

  return (
    <Box>
      <Center>
        <Box w="50%">
          <SelectController
            placeholder="border-t"
            values={bind ? borderValues : borderTopValues}
            property={bind ? borderProperty : borderTopProperty}
          />
        </Box>
      </Center>
      <HStack>
        <Box w="40%">
          <SelectController
            placeholder="border-l"
            values={bind ? borderValues : borderLeftValues}
            property={bind ? borderProperty : borderLeftProperty}
          />
        </Box>
        <Center w="20%">
          {bind ? (
            <Icon as={IoLink} w={8} h={8} color="gray.800" onClick={() => setBind(false)} />
          ) : (
            <Icon as={IoUnlink} w={8} h={8} color="gray.400" onClick={() => setBind(true)} />
          )}
        </Center>
        <Box w="40%">
          <SelectController
            placeholder="border-r"
            values={bind ? borderValues : borderRightValues}
            property={bind ? borderProperty : borderRightProperty}
          />
        </Box>
      </HStack>
      <Center>
        <Box w="50%">
          <SelectController
            placeholder="border-b"
            values={bind ? borderValues : borderBottomValues}
            property={bind ? borderProperty : borderBottomProperty}
          />
        </Box>
      </Center>
    </Box>
  )
}

export default BorderWidth
