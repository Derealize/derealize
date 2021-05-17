import React, { useMemo, useState, useContext, ChangeEvent } from 'react'
import { Checkbox } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { ContainerValue } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
// import useMatchVariants from '../useMatchVariants'
import { ElementState } from '../../../models/project'

const Tags = [
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
  const deleteProperty = useStoreActions((actions) => actions.project.deleteActiveElementProperty)
  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)

  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.containerPropertys)
  const property = useComputeProperty(propertys)

  // if (!useMatchVariants('container')) return <></>
  if (already && !property) return <></>
  if (!Tags.includes(element?.actualStatus?.tagName || '')) return <></>

  return (
    <Checkbox
      colorScheme="teal"
      checked={!!property}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && !property) {
          setProperty({
            propertyId: nanoid(),
            classname: ContainerValue,
          })
        } else if (!e.target.checked && property) {
          deleteProperty(property.id)
        }
        liveApplyClassName()
      }}
    >
      Container
    </Checkbox>
  )
}

export default Container
