import React, { useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import type { GroupType } from '../../SelectController'

const TextColor: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const values = useStoreState<Array<GroupType>>((state) => state.typography.textColorValues)
  const propertys = useStoreState<Array<Property>>((state) => state.typography.textColorPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="text-color" values={values} property={property} isColors />
}

export default TextColor
