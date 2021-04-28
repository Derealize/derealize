import React, { useState, useEffect } from 'react'
import { Select, VStack, Box, Text, Icon } from '@chakra-ui/react'
import cs from 'classnames'
import type { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import Variants from './Variants'
import LayoutSection from './layout/LayoutSection'
import SpacingSection from './spacing/SpacingSection'
import AdvancedSection from './advanced/AdvancedSection'
import ElementEdit from './ElementEdit'
// import { Project } from '../../models/project'

const AlreadySection: React.FC = (): JSX.Element => {
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.controlles.alreadyVariants)
  // const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  // const setPage = useStoreActions((actions) => actions.project.setPage)

  return (
    <VStack alignItems="stretch">
      {/* {!!frontProject && !!frontProject.config && (
        <Select
          variant="unstyled"
          value={frontProject.page}
          onChange={(e) => {
            setPage({ projectId: frontProject.id, page: e.target.value })
          }}
        >
          {frontProject.config.pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </Select>
      )} */}
      <Variants alreadyVariants={alreadyVariants} />
      <LayoutSection />
      <SpacingSection />
      <AdvancedSection />
      <ElementEdit />
    </VStack>
  )
}

export default AlreadySection
