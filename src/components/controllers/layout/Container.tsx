import React, { useMemo, useState, useEffect, ChangeEvent } from 'react'
import { Tooltip, VStack, Checkbox, CheckboxGroup, Box, Text } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Property } from '../../../models/controlles'
import type { Project } from '../../../models/project'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import style from './Container.module.scss'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Container: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const propertys = useStoreState<Array<Property>>((state) => state.layout.containerPropertys)
  const selectScreenVariant = useStoreState<string | null>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | null>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | null>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | null>((state) => state.controlles.selectCustomVariant)

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
          // send UpdateClass
        }}
      >
        container
      </Checkbox>
    </VStack>
  )
}

export default Container
