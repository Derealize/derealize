import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const RowStart: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)

  const values = useStoreState<Array<string>>((state) => state.layout.rowStartValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.rowStartPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('grid')) return <></>

  return <SelectController placeholder="row-start" values={values} property={property} />
}

export default RowStart
