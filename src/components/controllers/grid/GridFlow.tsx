import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'
import { GridFlowValues } from '../../../models/controlles/layout'

const GridFlow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  // const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)
  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.gridFlowPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!displayProperty || displayProperty.classname !== 'grid') return <></>
  // if (!element || element.display !== 'grid') return <></>

  return <SelectController placeholder="grid-flow" values={GridFlowValues} property={property} />
}

export default GridFlow
