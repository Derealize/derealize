import React, { useState, useContext } from 'react'
import { HStack, Center, Box, Text, Icon } from '@chakra-ui/react'
import { IoLink, IoUnlink } from 'react-icons/io5'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const BorderColor: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const values = useStoreState<Array<string>>((state) => state.border.borderColorValues)
  const propertys = useStoreState<Array<Property>>((state) => state.border.borderColorPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="border-color" values={values} property={property} />
}

export default BorderColor
