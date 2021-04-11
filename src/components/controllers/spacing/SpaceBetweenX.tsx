import React, { useMemo, useState, useEffect } from 'react'
import cs from 'classnames'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already?: boolean
}

const SpaceBetween: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const values = useStoreState<Array<string>>((state) => state.spacing.spaceXValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.spaceXPropertys)
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

  return (
    <SelectController
      placeholder="space-between"
      options={values.map((v) => ({ value: v, label: v }))}
      property={property}
    />
  )
}

SpaceBetween.defaultProps = {
  already: false,
}

export default SpaceBetween
