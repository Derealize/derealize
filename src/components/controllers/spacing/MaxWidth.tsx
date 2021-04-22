import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const MaxWidth: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.spacing.maxWidthValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.maxWidthPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.display?.includes('inline')) return <></>

  return <SelectController placeholder="max-width" values={values} property={property} />
}

export default MaxWidth
