import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

export const GridTagNames = [
  'body',
  'div',
  'main',
  'section',
  'aside',
  'nav',
  'menu',
  'footer',
  'header',
  'article',
  'details',
]

const GridCols: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.layout.gridColsValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.gridColsPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || !GridTagNames.includes(element.tagName || '')) return <></>

  return (
    <SelectController
      placeholder="grid-cols"
      options={values.map((v) => ({ value: v, label: v }))}
      property={property}
    />
  )
}

export default GridCols
