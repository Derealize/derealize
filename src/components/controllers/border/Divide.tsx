import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const DivideX: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const valuesX = useStoreState<Array<string>>((state) => state.border.divideXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.border.divideXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesY = useStoreState<Array<string>>((state) => state.border.divideYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.border.divideYPropertys)
  const propertyY = useComputeProperty(propertysY)

  if (already && !propertyX && !propertyY) return <></>

  return (
    <div>
      <SelectController placeholder="divide-y" values={valuesY} property={propertyY} />
      <SelectController placeholder="divide-x" values={valuesX} property={propertyX} />
    </div>
  )
}

export default DivideX
