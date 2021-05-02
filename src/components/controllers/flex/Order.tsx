import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const Order: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)

  const orderValues = useStoreState<Array<string>>((state) => state.layout.orderValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.orderPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.parentDisplay !== 'flex') return <></>

  return <SelectController placeholder="order" values={orderValues} property={property} />
}

export default Order
