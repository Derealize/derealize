import React, { useMemo, useState, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'
import Select from 'react-select'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import { OverscrollValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'

const Overscroll: React.FC = (): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertys = useStoreState<Array<Property>>((state) => state.layout.floatPropertys)
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
    <Select
      className="basic-single"
      defaultValue={colourOptions[0]}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isRtl={isRtl}
      isSearchable={isSearchable}
      name="color"
      options={colourOptions}
      onChange={(value) => {}}
    />
    // <Select
    //   placeholder="Float"
    //   colorScheme={property ? 'teal' : 'gray'}
    //   value={property?.classname}
    //   onChange={(value) => {
    //     if (!value && property) {
    //       deleteProperty(property.id)
    //     } else if (property) {
    //       property.classname = value.toString()
    //       setProperty(property)
    //     } else {
    //       setProperty({
    //         id: nanoid(),
    //         classname: value.toString(),
    //       } as Property)
    //     }
    //   }}
    // >
    //   {OverscrollBehaviorValues.map((value) => (
    //     <option key={value} value={value}>
    //       {value}
    //     </option>
    //   ))}
    // </Select>
  )
}

export default Overscroll
