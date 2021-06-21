import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { TransformValues } from '../../../models/controlles/effects'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const Transform: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const propertys = useStoreState<Array<Property>>((state) => state.effects.transformPropertys)
  const property = useComputeProperty(propertys)

  const originValues = useStoreState<Array<string>>((state) => state.effects.originValues)
  const originPropertys = useStoreState<Array<Property>>((state) => state.effects.originPropertys)
  const originProperty = useComputeProperty(originPropertys)

  const scaleValues = useStoreState<Array<string>>((state) => state.effects.scaleValues)
  const scalePropertys = useStoreState<Array<Property>>((state) => state.effects.scalePropertys)
  const scaleProperty = useComputeProperty(scalePropertys)

  const rotateValues = useStoreState<Array<string>>((state) => state.effects.rotateValues)
  const rotatePropertys = useStoreState<Array<Property>>((state) => state.effects.rotatePropertys)
  const rotateProperty = useComputeProperty(rotatePropertys)

  const translateYValues = useStoreState<Array<string>>((state) => state.effects.translateYValues)
  const translateYPropertys = useStoreState<Array<Property>>((state) => state.effects.translateYPropertys)
  const translateYProperty = useComputeProperty(translateYPropertys)

  const translateXValues = useStoreState<Array<string>>((state) => state.effects.translateXValues)
  const translateXPropertys = useStoreState<Array<Property>>((state) => state.effects.translateXPropertys)
  const translateXProperty = useComputeProperty(translateXPropertys)

  const skewYValues = useStoreState<Array<string>>((state) => state.effects.skewYValues)
  const skewYPropertys = useStoreState<Array<Property>>((state) => state.effects.skewYPropertys)
  const skewYProperty = useComputeProperty(skewYPropertys)

  const skewXValues = useStoreState<Array<string>>((state) => state.effects.skewXValues)
  const skewXPropertys = useStoreState<Array<Property>>((state) => state.effects.skewXPropertys)
  const skewXProperty = useComputeProperty(skewXPropertys)

  if (already && !property) return <></>

  return (
    <>
      <SelectController placeholder="transform" values={TransformValues} ignorePrefix={false} property={property} />
      {element?.actualStatus?.className.includes('transform') && (
        <>
          <SelectController
            placeholder="origin"
            doclink="transform-origin"
            values={originValues}
            property={originProperty}
          />
          <SelectController placeholder="scale" values={scaleValues} property={scaleProperty} />
          <SelectController placeholder="rotate" values={rotateValues} property={rotateProperty} />
          <SelectController
            placeholder="translate-y"
            doclink="translate"
            values={translateYValues}
            property={translateYProperty}
          />
          <SelectController
            placeholder="translate-x"
            doclink="translate"
            values={translateXValues}
            property={translateXProperty}
          />
          <SelectController placeholder="skew-y" doclink="skew" values={skewYValues} property={skewYProperty} />
          <SelectController placeholder="skew-x" doclink="skew" values={skewXValues} property={skewXProperty} />
        </>
      )}
    </>
  )
}

export default Transform
