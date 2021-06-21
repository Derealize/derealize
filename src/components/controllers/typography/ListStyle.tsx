import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ListStyleValues, ListStylePositionValues } from '../../../models/controlles/typography'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const Tags = ['ul', 'ol', 'dl']

const ListStyle: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const propertys = useStoreState<Array<Property>>((state) => state.typography.listStylePropertys)
  const property = useComputeProperty(propertys)

  const positionPropertys = useStoreState<Array<Property>>((state) => state.typography.listStylePositionPropertys)
  const positionProperty = useComputeProperty(positionPropertys)

  if (already && !property) return <></>
  if (!Tags.some((name) => element?.actualStatus?.tagName === name)) return <></>

  return (
    <>
      <SelectController placeholder="list-style" values={ListStyleValues} property={property} />
      <SelectController
        placeholder="list-style-position"
        values={ListStylePositionValues}
        property={positionProperty}
      />
    </>
  )
}

export default ListStyle
