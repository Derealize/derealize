import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'
import { ContainerTags } from '../LimitedTags'

const Gap: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  // const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)
  const displayPropertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const displayProperty = useComputeProperty(displayPropertys)

  const values = useStoreState<Array<string>>((state) => state.layout.gapValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.gapPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!displayProperty || displayProperty.classname !== 'grid') return <></>
  // if (!element || element.display !== 'grid') return <></>

  return <SelectController placeholder="gap" values={values} property={property} />
}

export default Gap
