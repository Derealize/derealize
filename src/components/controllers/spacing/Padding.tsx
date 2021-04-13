import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

const Padding: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.spacing.paddingValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.paddingPropertys)
  const property = useComputeProperty(propertys)

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.paddingYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.paddingYPropertys)
  const propertyY = useComputeProperty(propertysY)

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.paddingXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.paddingXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesTop = useStoreState<Array<string>>((state) => state.spacing.paddingTopValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.spacing.paddingTopPropertys)
  const propertyTop = useComputeProperty(propertysTop)

  const valuesBottom = useStoreState<Array<string>>((state) => state.spacing.paddingBottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.spacing.paddingBottomPropertys)
  const propertyBottom = useComputeProperty(propertysBottom)

  const valuesLeft = useStoreState<Array<string>>((state) => state.spacing.paddingLeftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.spacing.paddingLeftPropertys)
  const propertyLeft = useComputeProperty(propertysLeft)

  const valuesRight = useStoreState<Array<string>>((state) => state.spacing.paddingRightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.spacing.paddingRightPropertys)
  const propertyRight = useComputeProperty(propertysRight)

  if ((already && !property) || !element) return <></>

  return (
    <>
      <SelectController placeholder="padding" values={values} property={property} />
      {!element.display?.includes('inline') && (
        <SelectController placeholder="padding-y" values={valuesY} property={propertyY} />
      )}
      <SelectController placeholder="padding-x" values={valuesX} property={propertyX} />
      {!element.display?.includes('inline') && (
        <SelectController placeholder="padding-top" values={valuesTop} property={propertyTop} />
      )}
      {!element.display?.includes('inline') && (
        <SelectController placeholder="padding-bottom" values={valuesBottom} property={propertyBottom} />
      )}
      <SelectController placeholder="padding-left" values={valuesLeft} property={propertyLeft} />
      <SelectController placeholder="padding-right" values={valuesRight} property={propertyRight} />
    </>
  )
}

export default Padding
