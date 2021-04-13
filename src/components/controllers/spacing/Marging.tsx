import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

const Marging: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const values = useStoreState<Array<string>>((state) => state.spacing.marginValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.marginPropertys)
  const property = useComputeProperty(propertys)

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.marginYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.marginYPropertys)
  const propertyY = useComputeProperty(propertysY)

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.marginXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.marginXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesTop = useStoreState<Array<string>>((state) => state.spacing.marginTopValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.spacing.marginTopPropertys)
  const propertyTop = useComputeProperty(propertysTop)

  const valuesBottom = useStoreState<Array<string>>((state) => state.spacing.marginBottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.spacing.marginBottomPropertys)
  const propertyBottom = useComputeProperty(propertysBottom)

  const valuesLeft = useStoreState<Array<string>>((state) => state.spacing.marginLeftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.spacing.marginLeftPropertys)
  const propertyLeft = useComputeProperty(propertysLeft)

  const valuesRight = useStoreState<Array<string>>((state) => state.spacing.marginRightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.spacing.marginRightPropertys)
  const propertyRight = useComputeProperty(propertysRight)

  if ((already && !property) || !element) return <></>

  return (
    <>
      <SelectController placeholder="margin" values={values} property={property} />
      {!element.display?.includes('inline') && (
        <SelectController placeholder="margin-y" values={valuesY} property={propertyY} />
      )}
      <SelectController placeholder="margin-x" values={valuesX} property={propertyX} />
      {!element.display?.includes('inline') && (
        <SelectController placeholder="margin-top" values={valuesTop} property={propertyTop} />
      )}
      {!element.display?.includes('inline') && (
        <SelectController placeholder="margin-bottom" values={valuesBottom} property={propertyBottom} />
      )}
      <SelectController placeholder="margin-left" values={valuesLeft} property={propertyLeft} />
      <SelectController placeholder="margin-right" values={valuesRight} property={propertyRight} />
    </>
  )
}

export default Marging
