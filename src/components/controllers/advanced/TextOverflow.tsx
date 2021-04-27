import React, { useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { TextOverflowValues, WhitespaceValues } from '../../../models/controlles/advanced'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const TextOverflow: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.advanced.textOverflowPropertys)
  const property = useComputeProperty(propertys)

  const whitespacePropertys = useStoreState<Array<Property>>((state) => state.advanced.whitespacePropertys)
  const whitespaceProperty = useComputeProperty(whitespacePropertys)

  if (already && !property) return <></>

  return (
    <>
      <SelectController placeholder="text-overflow" values={TextOverflowValues} property={property} />
      <SelectController placeholder="whitespace" values={WhitespaceValues} property={whitespaceProperty} />
    </>
  )
}

export default TextOverflow
