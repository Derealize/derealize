import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const Animation: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const values = useStoreState<Array<string>>((state) => state.effects.animateValues)
  const propertys = useStoreState<Array<Property>>((state) => state.effects.animatePropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="animation" values={values} property={property} />
}

export default Animation
