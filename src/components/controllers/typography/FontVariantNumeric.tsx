import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { FontVariantNumericValues } from '../../../models/controlles/typography'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const FontVariantNumeric: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.typography.fontVariantNumericPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return (
    <SelectController
      placeholder="font-variant-numeric"
      values={FontVariantNumericValues}
      ignorePrefix={false}
      property={property}
    />
  )
}

export default FontVariantNumeric
