import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

const MaxHeight: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const values = useStoreState<Array<string>>((state) => state.spacing.maxHeightValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.maxHeightPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display?.includes('block')) return <></>

  return <SelectController placeholder="max-height" values={values} property={property} />
}

export default MaxHeight
