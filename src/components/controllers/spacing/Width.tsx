import React, { useMemo, useState, useContext } from 'react'
import { HStack, Box } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementState, Project } from '../../../models/project'
import { InlineDisplays } from '../../../utils/assest'

const Width: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const values = useStoreState<Array<string>>((state) => state.spacing.widthValues)
  const propertys = useStoreState<Array<Property>>((state) => state.spacing.widthPropertys)
  const property = useComputeProperty(propertys)

  const maxValues = useStoreState<Array<string>>((state) => state.spacing.maxWidthValues)
  const maxPropertys = useStoreState<Array<Property>>((state) => state.spacing.maxWidthPropertys)
  const maxProperty = useComputeProperty(maxPropertys)

  const minValues = useStoreState<Array<string>>((state) => state.spacing.minWidthValues)
  const minPropertys = useStoreState<Array<Property>>((state) => state.spacing.minWidthPropertys)
  const minProperty = useComputeProperty(minPropertys)

  if (already && !property && !maxProperty && !minProperty) return <></>
  if (InlineDisplays.some((v) => element?.actualStatus?.display === v)) return <></>

  return (
    <Box>
      <SelectController
        placeholder="width"
        values={values}
        property={property}
        isDisabled={!!maxProperty || !!minProperty}
      />
      <HStack spacing={0}>
        <SelectController placeholder="max" values={maxValues} property={maxProperty} isDisabled={!!property} />
        <SelectController placeholder="min" values={minValues} property={minProperty} isDisabled={!!property} />
      </HStack>
    </Box>
  )
}

export default Width
