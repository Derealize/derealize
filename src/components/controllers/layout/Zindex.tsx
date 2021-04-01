import React, { useMemo, useState, useEffect } from 'react'
import { Select, Box, Text } from '@chakra-ui/react'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'

type Props = {
  already?: boolean
}

const Zindex: React.FC<Props> = ({ already }: Props): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const zindexValues = useStoreState<Array<string>>((state) => state.layout.zindexValues)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.zindexPropertys)
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
      placeholder="Zindex"
      variant="flushed"
      colorScheme={property ? 'teal' : 'gray'}
      value={property?.classname}
      onChange={(e) => {
        if (!e.target.value && property) {
          deleteProperty(property.id)
        } else if (property) {
          property.classname = `z-${e.target.value}`
          setProperty(property)
        } else {
          setProperty({
            id: nanoid(),
            classname: `z-${e.target.value}`,
          } as Property)
        }
        updateClassName()
      }}
    >
      {zindexValues.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Select>
  )
}

Zindex.defaultProps = {
  already: false,
}

export default Zindex
