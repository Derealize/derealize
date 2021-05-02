import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { JustifyContentValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const JustifyContent: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  // const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)
  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.justifyContentPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!displayProperty || displayProperty.classname !== 'flex') return <></>
  // if (!element || element.display !== 'flex') return <></>

  return <SelectController placeholder="justify-content" values={JustifyContentValues} property={property} />
}

export default JustifyContent
