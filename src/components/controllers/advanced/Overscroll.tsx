import React, { useMemo, useState, useContext } from 'react'
import groupBy from 'lodash.groupBy'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { OverscrollValues } from '../../../models/controlles/advanced'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

const OverscrollGroups = groupBy<string>(OverscrollValues, (value) => {
  const array = value.split('-')
  array.splice(-1)
  return array.join('-')
})

const OverscrollOptions = Object.entries(OverscrollGroups).map(([label, values]) => ({
  label,
  options: values.map((value) => ({ value, label: value })),
}))

const Overscroll: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.advanced.overscrollPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element?.actualStatus?.display?.includes('block')) return <></>

  return <SelectController placeholder="overscroll" values={OverscrollOptions} property={property} />
}

export default Overscroll
