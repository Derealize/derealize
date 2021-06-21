import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const ColSpan: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const values = useStoreState<Array<string>>((state) => state.layout.colSpanValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.colSpanPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('grid')) return <></>

  return <SelectController placeholder="col-span" values={values} doclink="grid-column" property={property} />
}

export default ColSpan
