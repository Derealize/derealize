import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ListStyleValues, ListStylePositionValues } from '../../../models/controlles/advanced'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const Tags = ['ul', 'ol', 'dl']

const ListStyle: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.advanced.listStylePropertys)
  const property = useComputeProperty(propertys)

  const positionPropertys = useStoreState<Array<Property>>((state) => state.advanced.listStylePositionPropertys)
  const positionProperty = useComputeProperty(positionPropertys)

  if (already && !property) return <></>
  if (!element || !Tags.includes(element.tagName)) return <></>

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
