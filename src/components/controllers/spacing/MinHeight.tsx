import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const MinHeight: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.spacing.minHeightValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.minHeightPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.display === 'inline') return <></>

  return <SelectController placeholder="min-height" values={values} property={property} />
}

export default MinHeight
