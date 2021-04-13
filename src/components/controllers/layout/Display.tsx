import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { DisplayValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import useMatchVariants from '../useMatchVariants'

const Display: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const property = useComputeProperty(propertys)

  if (!useMatchVariants('display')) return <></>
  if (already && !property) return <></>

  return <SelectController placeholder="display" values={DisplayValues} property={property} onMouseEnter={false} />
}

export default Display
