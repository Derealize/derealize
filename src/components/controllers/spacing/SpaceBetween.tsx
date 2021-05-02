import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../interface'

const SpaceBetween: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.project.activeElement)

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.spaceXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.spaceXPropertys)
  const propertyX = useComputeProperty(propertysX)

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.spaceYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.spaceYPropertys)
  const propertyY = useComputeProperty(propertysY)

  if (already && !propertyX && !propertyY) return <></>
  if (!element || element.display?.includes('inline')) return <></>

  return (
    <>
      <SelectController placeholder="space-between-x" values={valuesX} property={propertyX} />
      <SelectController placeholder="space-between-y" values={valuesY} property={propertyY} />
    </>
  )
}

export default SpaceBetween
