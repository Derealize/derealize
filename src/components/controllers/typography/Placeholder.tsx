import React, { useContext } from 'react'
import type { Project } from '../../../models/project.interface'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController, { GroupType } from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const Tags = ['input', 'textarea']

const Placeholder: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)

  const values = useStoreState<Array<GroupType>>((state) => state.typography.placeholderColorValues)
  const propertys = useStoreState<Array<Property>>((state) => state.typography.placeholderColorPropertys)
  const property = useComputeProperty(propertys)

  const opacityValues = useStoreState<Array<string>>((state) => state.typography.placeholderOpacityValues)
  const opacityPropertys = useStoreState<Array<Property>>((state) => state.typography.placeholderOpacityPropertys)
  const opacityProperty = useComputeProperty(opacityPropertys)

  if (already && !property) return <></>
  if (!Tags.includes(element?.actualStatus?.tagName || '')) return <></>

  return (
    <>
      <SelectController placeholder="placeholder-color" values={values} property={property} />
      <SelectController
        placeholder="placeholder-opacity"
        values={opacityValues}
        property={opacityProperty}
        colors={project?.tailwindConfig?.theme.placeholderColor}
        colorsTheme="placeholderColor"
      />
    </>
  )
}

export default Placeholder
