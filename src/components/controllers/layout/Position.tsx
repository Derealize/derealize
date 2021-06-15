import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { PositionValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import SelectController from '../../SelectController'

const Position: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.positionPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>

  return (
    <SelectController
      placeholder="position"
      values={PositionValues}
      ignorePrefix={false}
      property={property}
      onMouseEnter={false}
    />
  )
}

export default Position
