import React, { useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { TextTransformValues } from '../../../models/controlles/typography'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const TextTransform: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.typography.textTransformPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return <SelectController placeholder="text-transform" values={TextTransformValues} property={property} />
}

export default TextTransform
