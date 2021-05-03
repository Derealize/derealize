import React, { useMemo, useState, useContext } from 'react'
import { HStack } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import Switch from 'react-switch'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { DisplayValues } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import theme from '../../../theme'

const Display: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.displayPropertys)
  const property = useComputeProperty(propertys)

  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.project.deleteActiveElementProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.liveUpdateClassName)

  if (already && !property) return <></>

  return (
    <>
      <SelectController placeholder="display" values={DisplayValues} property={property} onMouseEnter={false} />
      <HStack align="center" justify="space-between" px={2}>
        <span>Flex</span>
        <Switch
          checked={property?.classname === 'flex'}
          onChange={(check) => {
            if (check) {
              if (property) {
                setProperty({ propertyId: property.id, classname: 'flex' })
              } else {
                setProperty({ propertyId: nanoid(), classname: 'flex' })
              }
            } else if (property) {
              deleteProperty(property.id)
            }
            updateClassName(true)
          }}
          offColor={theme.colors.gray['300']}
          onColor={theme.colors.gray['300']}
          onHandleColor={theme.colors.teal['400']}
          offHandleColor={theme.colors.gray['400']}
          handleDiameter={26}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 6px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
        />
      </HStack>

      <HStack align="center" justify="space-between" px={2}>
        <span>Grid</span>
        <Switch
          checked={property?.classname === 'grid'}
          onChange={(check) => {
            if (check) {
              if (property) {
                setProperty({ propertyId: property.id, classname: 'grid' })
              } else {
                setProperty({ propertyId: nanoid(), classname: 'grid' })
              }
            } else if (property) {
              deleteProperty(property.id)
            }
            updateClassName(true)
          }}
          offColor={theme.colors.gray['300']}
          onColor={theme.colors.gray['300']}
          onHandleColor={theme.colors.teal['400']}
          offHandleColor={theme.colors.gray['400']}
          handleDiameter={26}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 6px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
        />
      </HStack>
    </>
  )
}

export default Display
