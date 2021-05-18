import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ClearValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'
import { InlineDisplays } from '../../../utils/assest'

const Clear: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.clearPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (InlineDisplays.some((v) => element?.actualStatus?.display === v)) return <></>

  return <SelectController placeholder="clear" values={ClearValues} property={property} />
}

export default Clear
