import React, { useState, useContext } from 'react'
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import Rounded from './Rounded'
import Border from './Border'
import Divide from './Divide'

const AdvancedSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.border.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}

      <Accordion defaultIndex={[0]} mt={4}>
        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Border
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Border />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Radius
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Rounded />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Divide
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Divide />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default AdvancedSection
