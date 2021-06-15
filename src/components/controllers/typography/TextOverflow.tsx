import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { TextOverflowValues, WhitespaceValues } from '../../../models/controlles/typography'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const TextOverflow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.typography.textOverflowPropertys)
  const property = useComputeProperty(propertys)

  const whitespacePropertys = useStoreState<Array<Property>>((state) => state.typography.whitespacePropertys)
  const whitespaceProperty = useComputeProperty(whitespacePropertys)

  if (already && !property) return <></>

  return (
    <>
      <SelectController
        placeholder="text-overflow"
        values={TextOverflowValues}
        ignorePrefix={false}
        property={property}
      />
      <SelectController placeholder="whitespace" values={WhitespaceValues} property={whitespaceProperty} />
    </>
  )
}

export default TextOverflow
