import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const GridRows: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.layout.gridRowsValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.gridRowsPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.display !== 'grid') return <></>

  return <SelectController placeholder="grid-rows" values={values} property={property} />
}

export default GridRows
