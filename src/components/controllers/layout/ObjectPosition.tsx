import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'
import { ReplacedElementTags } from '../LimitedTags'

const ObjectPosition: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.objectPositionPropertys)
  const values = useStoreState<Array<string>>((state) => state.layout.objectPositionValues)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || !ReplacedElementTags.includes(element.tagName)) return <></>

  return <SelectController placeholder="object-position" values={values} property={property} onMouseEnter={false} />
}

export default ObjectPosition
