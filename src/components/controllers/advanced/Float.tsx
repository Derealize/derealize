import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { FloatValues } from '../../../models/controlles/advanced'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
// import { ElementPayload } from '../../../interface'

const Float: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  // const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const propertys = useStoreState<Array<Property>>((state) => state.advanced.floatPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  // if (!element || element.display?.includes('inline')) return <></>

  return <SelectController placeholder="float" values={FloatValues} property={property} />
}

export default Float
