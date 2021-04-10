import React, { useMemo, useState, useEffect } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles/controlles'
import SelectController, { OptionType } from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already?: boolean
}

const Marging: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const values = useStoreState<Array<string>>((state) => state.spacing.marginValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.marginPropertys)
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
  const value = useMemo<OptionType | null>(
    () => (property ? { value: property.classname, label: property.classname } : null),
    [property],
  )

  const valuesY = useStoreState<Array<string>>((state) => state.spacing.marginYValues)
  const propertysY = useStoreState<Array<Property>>((state) => state.spacing.marginYPropertys)
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
  const valueY = useMemo<OptionType | null>(
    () => (propertyY ? { value: propertyY.classname, label: propertyY.classname } : null),
    [propertyY],
  )

  const valuesX = useStoreState<Array<string>>((state) => state.spacing.marginXValues)
  const propertysX = useStoreState<Array<Property>>((state) => state.spacing.marginXPropertys)
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
  const valueX = useMemo<OptionType | null>(
    () => (propertyX ? { value: propertyX.classname, label: propertyX.classname } : null),
    [propertyX],
  )

  const valuesTop = useStoreState<Array<string>>((state) => state.spacing.marginTopValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.spacing.marginTopPropertys)
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
  const valueTop = useMemo<OptionType | null>(
    () => (propertyTop ? { value: propertyTop.classname, label: propertyTop.classname } : null),
    [propertyTop],
  )

  const valuesBottom = useStoreState<Array<string>>((state) => state.spacing.marginBottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.spacing.marginBottomPropertys)
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
  const valueBottom = useMemo<OptionType | null>(
    () => (propertyBottom ? { value: propertyBottom.classname, label: propertyBottom.classname } : null),
    [propertyBottom],
  )

  const valuesLeft = useStoreState<Array<string>>((state) => state.spacing.marginLeftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.spacing.marginLeftPropertys)
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
  const valueLeft = useMemo<OptionType | null>(
    () => (propertyLeft ? { value: propertyLeft.classname, label: propertyLeft.classname } : null),
    [propertyLeft],
  )

  const valuesRight = useStoreState<Array<string>>((state) => state.spacing.marginRightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.spacing.marginRightPropertys)
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
  const valueRight = useMemo<OptionType | null>(
    () => (propertyRight ? { value: propertyRight.classname, label: propertyRight.classname } : null),
    [propertyRight],
  )

  if (already && !property) return <></>

  return (
    <>
      <SelectController
        placeholder="margin"
        options={values.map((v) => ({ value: v, label: v }))}
        currentValue={value}
        property={property}
      />
      <SelectController
        placeholder="margin-y"
        options={valuesY.map((v) => ({ value: v, label: v }))}
        currentValue={valueY}
        property={propertyY}
      />
      <SelectController
        placeholder="margin-x"
        options={valuesX.map((v) => ({ value: v, label: v }))}
        currentValue={valueX}
        property={propertyX}
      />
      <SelectController
        placeholder="margin-top"
        options={valuesTop.map((v) => ({ value: v, label: v }))}
        currentValue={valueTop}
        property={propertyTop}
      />
      <SelectController
        placeholder="margin-bottom"
        options={valuesBottom.map((v) => ({ value: v, label: v }))}
        currentValue={valueBottom}
        property={propertyBottom}
      />
      <SelectController
        placeholder="margin-left"
        options={valuesLeft.map((v) => ({ value: v, label: v }))}
        currentValue={valueLeft}
        property={propertyLeft}
      />
      <SelectController
        placeholder="margin-right"
        options={valuesRight.map((v) => ({ value: v, label: v }))}
        currentValue={valueRight}
        property={propertyRight}
      />
    </>
  )
}

Marging.defaultProps = {
  already: false,
}

export default Marging
