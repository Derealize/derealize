import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/project'

const Transition: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const values = useStoreState<Array<string>>((state) => state.effects.transitionValues)
  const propertys = useStoreState<Array<Property>>((state) => state.effects.transitionPropertys)
  const property = useComputeProperty(propertys)

  const durationValues = useStoreState<Array<string>>((state) => state.effects.durationValues)
  const durationPropertys = useStoreState<Array<Property>>((state) => state.effects.durationPropertys)
  const durationProperty = useComputeProperty(durationPropertys)

  const easeValues = useStoreState<Array<string>>((state) => state.effects.easeValues)
  const easePropertys = useStoreState<Array<Property>>((state) => state.effects.easePropertys)
  const easeProperty = useComputeProperty(easePropertys)

  const delayValues = useStoreState<Array<string>>((state) => state.effects.delayValues)
  const delayPropertys = useStoreState<Array<Property>>((state) => state.effects.delayPropertys)
  const delayProperty = useComputeProperty(delayPropertys)

  if (already && !property) return <></>

  return (
    <>
      <SelectController placeholder="transition" values={values} property={property} />
      {element?.actualStatus?.className.includes('transition') && (
        <>
          <SelectController placeholder="duration" values={durationValues} property={durationProperty} />
          <SelectController placeholder="timing-function" values={easeValues} property={easeProperty} />
          <SelectController placeholder="delay" values={delayValues} property={delayProperty} />
        </>
      )}
    </>
  )
}

export default Transition
