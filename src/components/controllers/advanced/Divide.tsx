import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { BorderStyleValues } from '../../../models/controlles/border'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const DivideX: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const valuesX = useStoreState<Array<string>>((state) => state.advanced.divideXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.advanced.divideXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesY = useStoreState<Array<string>>((state) => state.advanced.divideYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.advanced.divideYPropertys)
  const propertyY = useComputeProperty(propertysY)

  const valuesColor = useStoreState<Array<string>>((state) => state.advanced.divideColorValues)
  const propertysColor = useStoreState<Array<Property>>((state) => state.advanced.divideColorPropertys)
  const propertyColor = useComputeProperty(propertysColor)

  const valuesOpacity = useStoreState<Array<string>>((state) => state.advanced.divideOpacityValues)
  const propertysOpacity = useStoreState<Array<Property>>((state) => state.advanced.divideOpacityPropertys)
  const propertyOpacity = useComputeProperty(propertysOpacity)

  const propertysStyle = useStoreState<Array<Property>>((state) => state.advanced.divideStylePropertys)
  const propertyStyle = useComputeProperty(propertysStyle)

  if (already && !propertyX && !propertyY) return <></>

  return (
    <>
      <div>
        <SelectController placeholder="divide-y" values={valuesY} property={propertyY} />
        <SelectController placeholder="divide-x" values={valuesX} property={propertyX} />
      </div>
      <div>
        <SelectController placeholder="divide-color" values={valuesColor} property={propertyColor} />
        <SelectController placeholder="divide-opacity" values={valuesOpacity} property={propertyOpacity} />
        <SelectController placeholder="divide-style" values={BorderStyleValues} property={propertyStyle} />
      </div>
    </>
  )
}

export default DivideX
