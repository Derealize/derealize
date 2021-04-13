import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

export const InsetPositions = ['fixed', 'absolute', 'relative', 'sticky']

const Inset: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.layout.insetValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.insetPropertys)
  const property = useComputeProperty(propertys)

  const valuesY = useStoreState<Array<string>>((state) => state.layout.insetYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.layout.insetYPropertys)
  const propertyY = useComputeProperty(propertysY)

  const valuesX = useStoreState<Array<string>>((state) => state.layout.insetXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.layout.insetXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesTop = useStoreState<Array<string>>((state) => state.layout.topValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.layout.topPropertys)
  const propertyTop = useComputeProperty(propertysTop)

  const valuesBottom = useStoreState<Array<string>>((state) => state.layout.bottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.layout.bottomPropertys)
  const propertyBottom = useComputeProperty(propertysBottom)

  const valuesLeft = useStoreState<Array<string>>((state) => state.layout.leftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.layout.leftPropertys)
  const propertyLeft = useComputeProperty(propertysLeft)

  const valuesRight = useStoreState<Array<string>>((state) => state.layout.rightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.layout.rightPropertys)
  const propertyRight = useComputeProperty(propertysRight)

  if (already && !property) return <></>
  if (!element?.position || !InsetPositions.includes(element.position)) return <></>

  return (
    <>
      <SelectController placeholder="inset" values={values} property={property} />
      <SelectController placeholder="inset-y" values={valuesY} property={propertyY} />
      <SelectController placeholder="inset-x" values={valuesX} property={propertyX} />
      <SelectController placeholder="inset-top" values={valuesTop} property={propertyTop} />
      <SelectController placeholder="inset-bottom" values={valuesBottom} property={propertyBottom} />
      <SelectController placeholder="inset-left" values={valuesLeft} property={propertyLeft} />
      <SelectController placeholder="inset-right" values={valuesRight} property={propertyRight} />
    </>
  )
}

export default Inset
