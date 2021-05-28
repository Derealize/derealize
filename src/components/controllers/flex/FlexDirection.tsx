import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { FlexDirectionValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const FlexDirection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.flexDirectionPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display.includes('flex')) return <></>

  return <SelectController placeholder="flex-direction" values={FlexDirectionValues} property={property} />
}

export default FlexDirection
