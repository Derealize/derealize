import React, { useMemo, useState, useEffect, ChangeEvent } from 'react'
import { RadioGroup, Stack, Radio, Box, Text } from '@chakra-ui/react'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import { BoxSizingName } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import style from './BoxSizing.module.scss'

const BoxSizing: React.FC = (): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.boxSizingPropertys)
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

  return (
    <RadioGroup
      value={property?.classname}
      onChange={(value) => {
        if (property) {
          property.classname = value.toString()
          setProperty(property)
        } else {
          setProperty({
            id: nanoid(),
            classname: value.toString(),
          } as Property)
        }
      }}
    >
      <Stack direction="row">
        {BoxSizingName.map((name) => (
          <Radio key={name} value={name}>
            {name}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  )
}

export default BoxSizing
