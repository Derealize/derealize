import React, { useMemo, useState, useEffect } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already?: boolean
}

const Padding: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const values = useStoreState<Array<string>>((state) => state.spacing.paddingValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.paddingPropertys)
  const property = useMemo<Property | undefined>(
    () =>
      propertys.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertys, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.paddingYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.paddingYPropertys)
  const propertyY = useMemo<Property | undefined>(
    () =>
      propertysY.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysY, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.paddingXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.paddingXPropertys)
  const propertyX = useMemo<Property | undefined>(
    () =>
      propertysX.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysX, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesTop = useStoreState<Array<string>>((state) => state.spacing.paddingTopValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.spacing.paddingTopPropertys)
  const propertyTop = useMemo<Property | undefined>(
    () =>
      propertysTop.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysTop, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesBottom = useStoreState<Array<string>>((state) => state.spacing.paddingBottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.spacing.paddingBottomPropertys)
  const propertyBottom = useMemo<Property | undefined>(
    () =>
      propertysBottom.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysBottom, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesLeft = useStoreState<Array<string>>((state) => state.spacing.paddingLeftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.spacing.paddingLeftPropertys)
  const propertyLeft = useMemo<Property | undefined>(
    () =>
      propertysLeft.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysLeft, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const valuesRight = useStoreState<Array<string>>((state) => state.spacing.paddingRightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.spacing.paddingRightPropertys)
  const propertyRight = useMemo<Property | undefined>(
    () =>
      propertysRight.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [propertysRight, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  if (already && !property) return <></>

  return (
    <>
      <SelectController
        placeholder="padding"
        options={values.map((v) => ({ value: v, label: v }))}
        property={property}
      />
      <SelectController
        placeholder="padding-y"
        options={valuesY.map((v) => ({ value: v, label: v }))}
        property={propertyY}
      />
      <SelectController
        placeholder="padding-x"
        options={valuesX.map((v) => ({ value: v, label: v }))}
        property={propertyX}
      />
      <SelectController
        placeholder="padding-top"
        options={valuesTop.map((v) => ({ value: v, label: v }))}
        property={propertyTop}
      />
      <SelectController
        placeholder="padding-bottom"
        options={valuesBottom.map((v) => ({ value: v, label: v }))}
        property={propertyBottom}
      />
      <SelectController
        placeholder="padding-left"
        options={valuesLeft.map((v) => ({ value: v, label: v }))}
        property={propertyLeft}
      />
      <SelectController
        placeholder="padding-right"
        options={valuesRight.map((v) => ({ value: v, label: v }))}
        property={propertyRight}
      />
    </>
  )
}

Padding.defaultProps = {
  already: false,
}

export default Padding
