import React, { useMemo, useState, useEffect } from 'react'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles/controlles'
import SelectController, { OptionType } from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already?: boolean
}

const MinWidth: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const values = useStoreState<Array<string>>((state) => state.spacing.minWidthValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.minWidthPropertys)
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

  if (already && !property) return <></>

  return (
    <SelectController
      placeholder="min-height"
      options={values.map((v) => ({ value: v, label: v }))}
      value={value}
      onChange={(cvalue, { action }) => {
        if (action === 'clear' && property) {
          deleteProperty(property.id)
        } else if (action === 'select-option' && cvalue) {
          if (property) {
            property.classname = `min-h-${(cvalue as OptionType).value}`
            setProperty(property)
          } else {
            setProperty({
              id: nanoid(),
              classname: `min-h-${(cvalue as OptionType).value}`,
            } as Property)
          }
        }
        updateClassName()
      }}
    />
  )
}

MinWidth.defaultProps = {
  already: false,
}

export default MinWidth