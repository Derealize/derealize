import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { AlignSelfValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

const AlignSelf: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.alignSelfPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || element.parentDisplay !== 'flex') return <></>

  return <SelectController placeholder="align-self" values={AlignSelfValues} property={property} />
}

export default AlignSelf
