import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { JustifyContentValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const JustifyContent: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.justifyContentPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display.includes('flex')) return <></>

  return <SelectController placeholder="justify-content" values={JustifyContentValues} property={property} />
}

export default JustifyContent
