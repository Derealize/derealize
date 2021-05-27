import React, { useContext } from 'react'
import type { Project } from '../../../models/project.interface'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController, { GroupType } from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const TextColor: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)

  const values = useStoreState<Array<GroupType>>((state) => state.typography.textColorValues)
  const propertys = useStoreState<Array<Property>>((state) => state.typography.textColorPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return (
    <SelectController
      placeholder="text-color"
      values={values}
      property={property}
      colors={project?.tailwindConfig?.theme.textColor}
      colorsTheme="textColor"
    />
  )
}

export default TextColor
