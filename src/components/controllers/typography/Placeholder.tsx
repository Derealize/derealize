import React, { useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

const Tags = ['input', 'textarea']

const Placeholder: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const values = useStoreState<Array<string>>((state) => state.typography.placeholderValues)
  const propertys = useStoreState<Array<Property>>((state) => state.typography.placeholderPropertys)
  const property = useComputeProperty(propertys)

  const opacityValues = useStoreState<Array<string>>((state) => state.typography.placeholderOpacityValues)
  const opacityPropertys = useStoreState<Array<Property>>((state) => state.typography.placeholderOpacityPropertys)
  const opacityProperty = useComputeProperty(opacityPropertys)

  if (already && !property) return <></>
  if (!Tags.includes(element?.actualStatus?.tagName || '')) return <></>

  return (
    <>
      <SelectController placeholder="placeholder" values={values} property={property} />
      <SelectController placeholder="placeholder-opacity" values={opacityValues} property={opacityProperty} />
    </>
  )
}

export default Placeholder
