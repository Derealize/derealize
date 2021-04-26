import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { BorderStyleValues } from '../../../models/controlles/border'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const DivideStyle: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.border.divideStylePropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="divide-style" values={BorderStyleValues} property={property} />
}

export default DivideStyle
