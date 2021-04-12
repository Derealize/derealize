import React, { useMemo, useState, useContext, ChangeEvent } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ContainerValue } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'

const TagNames = [
  'div',
  'main',
  'section',
  'table',
  'nav',
  'footer',
  'frame',
  'iframe',
  'header',
  'article',
  'embed',
  'object',
  'map',
]
const Container: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.containerPropertys)
  const property = useComputeProperty(propertys)

  if (already && !property) return <></>
  if (!element || TagNames.includes(element.tagName || '')) return <></>

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
        updateClassName()
      }}
    >
      Container
    </Checkbox>
  )
}

export default Container
