import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

const RowStart: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.layout.rowStartValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.rowStartPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.parentDisplay !== 'grid') return <></>

  return <SelectController placeholder="row-start" values={values} property={property} />
}

export default RowStart
