import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Text, Icon } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const BorderOpacity: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const values = useStoreState<Array<string>>((state) => state.border.borderOpacityValues)
  const propertys = useStoreState<Array<Property>>((state) => state.border.borderOpacityPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="border-opacity" values={values} property={property} />
}

export default BorderOpacity
