import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'
import { GridFlowValues } from '../../../models/controlles/layout'

const GridFlow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.gridFlowPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.display !== 'grid') return <></>

  return <SelectController placeholder="grid-flow" values={GridFlowValues} property={property} />
}

export default GridFlow
