import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const Padding: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

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

  if ((already && !propertyTop && !propertyBottom && !propertyLeft && !propertyRight) || !element) return <></>

  return (
    <>
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
