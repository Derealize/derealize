import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const FlexGrow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const flexGrowValues = useStoreState<Array<string>>((state) => state.layout.flexGrowValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.flexGrowPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('flex')) return <></>

  return <SelectController placeholder="flex-grow" values={flexGrowValues} property={property} />
}

export default FlexGrow
