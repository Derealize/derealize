import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

const FlexShrink: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const flexShrinkValues = useStoreState<Array<string>>((state) => state.layout.flexShrinkValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.flexShrinkPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.parentDisplay?.includes('flex')) return <></>

  return <SelectController placeholder="flex-shrink" values={flexShrinkValues} property={property} />
}

export default FlexShrink
