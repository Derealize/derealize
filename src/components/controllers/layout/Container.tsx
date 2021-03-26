import React, { useMemo, useState, useEffect, ChangeEvent } from 'react'
import { Tooltip, VStack, Checkbox, CheckboxGroup, Box, Text } from '@chakra-ui/react'
import clone from 'lodash.clonedeep'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import { UpdatePayload } from '../../../models/controlles'
import type { Project } from '../../../models/project'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import style from './Container.module.scss'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow

const ContainerName = 'container'

type Props = {
  project: Project
}

const Container: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const propertys = useStoreState<Array<Property>>((state) => state.controlles.propertys)

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)

  const propertysClone = useMemo<Array<Property>>(() => clone(propertys), [propertys])
  const containerPropertys = useMemo<Array<Property>>(
    () => propertysClone.filter((property) => property.classname === ContainerName),
    [propertysClone],
  )

  const property = useMemo<Property | undefined>(
    () =>
      containerPropertys.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant,
      ),
    [containerPropertys, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant],
  )

  const [modified, setModified] = useState<boolean | null>(null)

  const checked = useMemo<boolean | Property | undefined>(() => {
    if (modified !== null) return modified
    return property
  }, [modified, property])

  return (
    <VStack className={style.layout}>
      <Checkbox
        colorScheme="teal"
        checked={!!checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setModified(e.target.checked)
          // if (property) {
          //   if (e.target.checked) {
          //     property.classname = ContainerName
          //   } else {
          //     property.value = 'delete'
          //   }
          // } else {
          // }
        }}
      >
        container
      </Checkbox>
    </VStack>
  )
}

export default Container
