import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const Flex: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)

  const flexValues = useStoreState<Array<string>>((state) => state.layout.flexValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.flexPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('felx')) return <></>

  return <SelectController placeholder="flex" values={flexValues} property={property} />
}

export default Flex
