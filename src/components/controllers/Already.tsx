import React, { useState, useEffect } from 'react'
import { Select, VStack, Box, Text, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import Variants from './Variants'
import LayoutSection from './layout/LayoutSection'
import FlexSection from './flex/FlexSection'
import SpacingSection from './spacing/SpacingSection'
import { Project } from '../../models/project'

const Already: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)
  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  const setPage = useStoreActions((actions) => actions.project.setPage)

  return (
    <VStack alignItems="flex-start">
      {!!frontProject && !!frontProject.config && (
        <Select
          variant="unstyled"
          value={frontProject.page}
          onChange={(e) => {
            setPage({ projectId: frontProject.url, page: e.target.value })
          }}
        >
          {frontProject.config.pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </Select>
      )}
      <Variants alreadyVariants={alreadyVariants} />
      <LayoutSection already />
      <FlexSection already />
      <SpacingSection already />
    </VStack>
  )
}

export default Already
