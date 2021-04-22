import React, { useMemo, useState, useContext } from 'react'
import groupBy from 'lodash.groupBy'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { OverflowValues } from '../../../models/controlles/layout'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const OverflowGroups = groupBy<string>(OverflowValues, (value) => {
  const array = value.split('-')
  array.splice(-1)
  return array.join('-')
})

const OverflowOptions = Object.entries(OverflowGroups).map(([label, values]) => ({
  label,
  options: values.map((value) => ({ value, label: value })),
}))

const Overflow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.overflowPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.display?.includes('inline')) return <></>

  return <SelectController placeholder="overflow" values={OverflowOptions} property={property} />
}

export default Overflow
