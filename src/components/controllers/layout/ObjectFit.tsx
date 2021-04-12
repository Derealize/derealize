import React, { useMemo, useState, useContext } from 'react'
import { Select, Box, Text } from '@chakra-ui/react'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import ControllersContext from '../../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ObjectFitValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'

const ObjectFit: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.objectFitPropertys)
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

  if (already && !property) return <></>

  return (
    <Select
      placeholder="Object Fit"
      variant="flushed"
      colorScheme={property ? 'teal' : 'gray'}
      value={property?.classname}
      onChange={(e) => {
        if (!e.target.value && property) {
          deleteProperty(property.id)
        } else if (property) {
          property.classname = e.target.value
          setProperty(property)
        } else {
          setProperty({
            id: nanoid(),
            classname: e.target.value,
          } as Property)
        }
        updateClassName()
      }}
    >
      {ObjectFitValues.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </Select>
  )
}

export default ObjectFit
