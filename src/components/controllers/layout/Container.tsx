import React, { useMemo, useState, useEffect, ChangeEvent } from 'react'
import { Tooltip, VStack, Checkbox, Box, Text } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import { ContainerValue } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'

const Container: React.FC = (): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.containerPropertys)
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
    <Checkbox
      colorScheme="teal"
      checked={!!property}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && !property) {
          setProperty({
            id: nanoid(),
            classname: ContainerValue,
          } as Property)
        } else if (!e.target.checked && property) {
          deleteProperty(property.id)
        }
      }}
    >
      Container
    </Checkbox>
  )
}

export default Container
