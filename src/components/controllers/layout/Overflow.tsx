import React, { useMemo, useState, useContext } from 'react'
import groupBy from 'lodash.groupBy'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { OverflowValues } from '../../../models/controlles/layout'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'

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
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.overflowPropertys)
  const property = useMemo<Property | undefined>(
    () =>
      propertys.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertys, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  if (already && !property) return <></>

  return <SelectController placeholder="Overscroll" options={OverflowOptions} property={property} />
}

export default Overflow
