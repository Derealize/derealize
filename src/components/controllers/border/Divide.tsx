import React, { useState, useContext } from 'react'
import type { Project } from '../../../models/project.interface'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController, { GroupType } from '../../SelectController'
import { BorderStyleValues } from '../../../models/controlles/border'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'

const DivideX: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)

  const valuesX = useStoreState<Array<string>>((state) => state.border.divideXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.border.divideXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesY = useStoreState<Array<string>>((state) => state.border.divideYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.border.divideYPropertys)
  const propertyY = useComputeProperty(propertysY)

  const valuesColor = useStoreState<Array<GroupType>>((state) => state.border.divideColorValues)
  const propertysColor = useStoreState<Array<Property>>((state) => state.border.divideColorPropertys)
  const propertyColor = useComputeProperty(propertysColor)

  const valuesOpacity = useStoreState<Array<string>>((state) => state.border.divideOpacityValues)
  const propertysOpacity = useStoreState<Array<Property>>((state) => state.border.divideOpacityPropertys)
  const propertyOpacity = useComputeProperty(propertysOpacity)

  const propertysStyle = useStoreState<Array<Property>>((state) => state.border.divideStylePropertys)
  const propertyStyle = useComputeProperty(propertysStyle)

  if (already && !propertyX && !propertyY) return <></>

  return (
    <>
      <div>
        <SelectController placeholder="divide-y" values={valuesY} property={propertyY} />
        <SelectController placeholder="divide-x" values={valuesX} property={propertyX} />
      </div>
      <div>
        <SelectController
          placeholder="divide-color"
          values={valuesColor}
          property={propertyColor}
          colors={project?.tailwindConfig?.theme.divideColor}
          colorsTheme="divideColor"
        />
        <SelectController placeholder="divide-opacity" values={valuesOpacity} property={propertyOpacity} />
        <SelectController placeholder="divide-style" values={BorderStyleValues} property={propertyStyle} />
      </div>
    </>
  )
}

export default DivideX
