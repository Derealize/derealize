import React, { useMemo, useState, useContext } from 'react'
import groupBy from 'lodash.groupBy'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { OverscrollValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'
import { InlineDisplays } from '../../../utils/assest'

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
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.overscrollPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (InlineDisplays.some((v) => element?.actualStatus?.display === v)) return <></>

  return <SelectController placeholder="overscroll" values={OverscrollOptions} property={property} />
}

export default Overscroll
