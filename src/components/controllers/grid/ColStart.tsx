import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'
import { ElementState } from '../../../models/element'

const ColStart: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const values = useStoreState<Array<string>>((state) => state.layout.colStartValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.colStartPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('grid')) return <></>

  return <SelectController placeholder="col-start" values={values} doclink="grid-column" property={property} />
}

export default ColStart
