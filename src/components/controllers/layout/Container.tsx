import React, { useMemo, useState, useContext, ChangeEvent } from 'react'
import { Checkbox } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { Project } from '../../../models/project.interface'
import type { Property } from '../../../models/controlles/controlles'
import { ContainerValue } from '../../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
// import useMatchVariants from '../useMatchVariants'
import { ElementState } from '../../../models/element'

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

  const pushNewProperty = useStoreActions((actions) => actions.controlles.pushNewProperty)
  const deleteProperty = useStoreActions((actions) => actions.element.deleteActiveElementProperty)
  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)

  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const propertys = useStoreState<Array<Property>>((state) => state.layout.containerPropertys)
  const property = useComputeProperty(propertys)

  // if (!useMatchVariants('container')) return <></>
  if (!project) return <></>
  if (already && !property) return <></>
  if (!Tags.includes(element?.actualStatus?.tagName || '')) return <></>

  return (
    <Checkbox
      colorScheme="teal"
      checked={!!property}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && !property) {
          pushNewProperty(ContainerValue)
        } else if (!e.target.checked && property) {
          deleteProperty({ projectId: project.id, propertyId: property.id })
        }
        liveApplyClassName()
      }}
    >
      Container
    </Checkbox>
  )
}

export default Container
