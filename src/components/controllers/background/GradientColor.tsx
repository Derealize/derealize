import React, { useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'

const GradientColor: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const fromValues = useStoreState<Array<string>>((state) => state.background.fromColorValues)
  const fromPropertys = useStoreState<Array<Property>>((state) => state.background.fromColorPropertys)
  const fromProperty = useComputeProperty(fromPropertys)

  const viaValues = useStoreState<Array<string>>((state) => state.background.viaColorValues)
  const viaPropertys = useStoreState<Array<Property>>((state) => state.background.viaColorPropertys)
  const viaProperty = useComputeProperty(viaPropertys)

  const toValues = useStoreState<Array<string>>((state) => state.background.toColorValues)
  const toPropertys = useStoreState<Array<Property>>((state) => state.background.toColorPropertys)
  const toProperty = useComputeProperty(toPropertys)

  if (already && !property) return <></>

  return (
    <>
      <SelectController placeholder="from-color" values={fromValues} property={fromProperty} />
      <SelectController placeholder="via-color" values={viaValues} property={viaProperty} />
      <SelectController placeholder="to-color" values={toValues} property={toProperty} />
    </>
  )
}

export default GradientColor
