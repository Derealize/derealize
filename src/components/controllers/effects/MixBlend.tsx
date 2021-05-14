import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { MixBlendValues } from '../../../models/controlles/effects'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const MixBlend: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.effects.mixBlendPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="mix-blend" values={MixBlendValues} property={property} />
}

export default MixBlend
