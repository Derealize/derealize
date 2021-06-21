import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { GridAutoFlowValues } from '../../../models/controlles/layout'
import { ElementState } from '../../../models/element'

const AutoFlow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.autoFlowPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display.includes('grid')) return <></>

  return (
    <SelectController
      placeholder="auto-flow"
      doclink="grid-auto-flow"
      values={GridAutoFlowValues}
      property={property}
    />
  )
}

export default AutoFlow
