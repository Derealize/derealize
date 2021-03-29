import React, { useMemo, useState, useEffect } from 'react'
import { Select, Box, Text } from '@chakra-ui/react'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already: boolean
}

const Flex: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const flexValues = useStoreState<Array<string>>((state) => state.flex.flexValues)
  const propertys = useStoreState<Array<Property>>((state) => state.flex.flexPropertys)
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
      placeholder="Flex"
      colorScheme={property ? 'teal' : 'gray'}
      value={property?.classname}
      onChange={(value) => {
        if (!value && property) {
          deleteProperty(property.id)
        } else if (property) {
          property.classname = `flex-${value.toString()}`
          setProperty(property)
        } else {
          setProperty({
            id: nanoid(),
            classname: `flex-${value.toString()}`,
          } as Property)
        }
      }}
    >
      {flexValues.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Select>
  )
}

export default Flex
