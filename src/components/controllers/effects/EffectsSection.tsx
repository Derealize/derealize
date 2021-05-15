import React, { useState, useContext } from 'react'
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import BoxShadow from './BoxShadow'
import Opacity from './Opacity'
import Transition from './Transition'
import Animation from './Animation'
import Transform from './Transform'
import MixBlend from './MixBlend'
import BackgroundBlend from './BackgroundBlend'

const EffectsSection: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const alreadyVariants = useStoreState<AlreadyVariants>((state) => state.typography.alreadyVariants)

  return (
    <>
      {!already && <Variants alreadyVariants={alreadyVariants} />}

      <Accordion defaultIndex={[0]} mt={4}>
        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Effects
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <BoxShadow />
            <Opacity />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Transition
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Transition />
            <Animation />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Transform
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Transform />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Advanced
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <MixBlend />
            <BackgroundBlend />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default EffectsSection
