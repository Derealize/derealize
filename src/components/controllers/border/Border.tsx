import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Text, Icon } from '@chakra-ui/react'
import { IoLink, IoUnlink } from 'react-icons/io5'
import type { Project } from '../../../models/project.interface'
import ControllersContext from '../ControllersContext'
import { BorderStyleValues } from '../../../models/controlles/border'
import type { Property } from '../../../models/controlles/controlles'
import SelectController, { GroupType } from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const Border: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
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

  const propertysStyle = useStoreState<Array<Property>>((state) => state.border.borderStylePropertys)
  const propertyStyle = useComputeProperty(propertysStyle)

  const valuesColor = useStoreState<Array<GroupType>>((state) => state.border.borderColorValues)
  const propertysColor = useStoreState<Array<Property>>((state) => state.border.borderColorPropertys)
  const propertyColor = useComputeProperty(propertysColor)

  const valuesOpacity = useStoreState<Array<string>>((state) => state.border.borderOpacityValues)
  const propertysOpacity = useStoreState<Array<Property>>((state) => state.border.borderOpacityPropertys)
  const propertyOpacity = useComputeProperty(propertysOpacity)

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
    <>
      <div>
        <Center>
          <Box w="50%">
            <SelectController
              placeholder={bind ? 'border' : 'border-t'}
              values={bind ? borderValues : borderTopValues}
              property={bind ? borderProperty : borderTopProperty}
            />
          </Box>
        </Center>
        <HStack spacing={0}>
          <Box w="44%">
            <SelectController
              placeholder={bind ? 'border' : 'border-l'}
              values={bind ? borderValues : borderLeftValues}
              property={bind ? borderProperty : borderLeftProperty}
            />
          </Box>
          <Center w="12%">
            {bind ? (
              <Icon as={IoLink} w={6} h={6} color="gray.600" onClick={() => setBind(false)} />
            ) : (
              <Icon as={IoUnlink} w={6} h={6} color="gray.400" onClick={() => setBind(true)} />
            )}
          </Center>
          <Box w="44%">
            <SelectController
              placeholder={bind ? 'border' : 'border-r'}
              values={bind ? borderValues : borderRightValues}
              property={bind ? borderProperty : borderRightProperty}
            />
          </Box>
        </HStack>
        <Center>
          <Box w="50%">
            <SelectController
              placeholder={bind ? 'border' : 'border-b'}
              values={bind ? borderValues : borderBottomValues}
              property={bind ? borderProperty : borderBottomProperty}
            />
          </Box>
        </Center>
      </div>
      <div>
        <SelectController placeholder="border-style" values={BorderStyleValues} property={propertyStyle} />
        <SelectController
          placeholder="border-color"
          values={valuesColor}
          property={propertyColor}
          colors={project?.tailwindConfig?.theme.borderColor}
          colorsTheme="borderColor"
        />
        <SelectController placeholder="border-opacity" values={valuesOpacity} property={propertyOpacity} />
      </div>
    </>
  )
}

export default Border
