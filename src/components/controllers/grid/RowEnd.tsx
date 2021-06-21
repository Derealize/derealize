import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const RowEnd: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const values = useStoreState<Array<string>>((state) => state.layout.rowEndValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.rowEndPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display.includes('grid')) return <></>

  return <SelectController placeholder="row-end" values={values} doclink="grid-row" property={property} />
}

export default RowEnd
