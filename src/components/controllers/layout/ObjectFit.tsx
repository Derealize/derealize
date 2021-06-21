import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ObjectFitValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'
import { ReplacedElementTags } from '../LimitedTags'

const ObjectFit: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.objectFitPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!ReplacedElementTags.includes(element?.actualStatus?.tagName || '')) return <></>

  return <SelectController placeholder="object-fit" values={ObjectFitValues} property={property} onMouseEnter={false} />
}

export default ObjectFit
