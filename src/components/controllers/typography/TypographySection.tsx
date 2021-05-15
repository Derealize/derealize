import React, { useState, useContext } from 'react'
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { AlreadyVariants } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import Variants from '../Variants'
import FontFamily from './FontFamily'
import FontSize from './FontSize'
import FontWeight from './FontWeight'
import LineHeight from './LineHeight'
import LetterSpacing from './LetterSpacing'
import Placeholder from './Placeholder'
import Text from './Text'
import TextAlign from './TextAlign'
import TextColor from './TextColor'
import TextDecoration from './TextDecoration'
import TextOpacity from './TextOpacity'
import TextTransform from './TextTransform'

import FontSmoothing from './FontSmoothing'
import FontStyle from './FontStyle'
import FontVariantNumeric from './FontVariantNumeric'
import ListStyle from './ListStyle'
import TextOverflow from './TextOverflow'
import VerticalAlign from './VerticalAlign'
import WordBreak from './WordBreak'

const TypographySection: React.FC = (): JSX.Element => {
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
                Text
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <Text />
            <FontSize />
            <TextColor />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Text Effects
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <FontFamily />
            <FontWeight />
            <TextDecoration />
            <TextOpacity />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton px={1}>
              <Box flex="1" textAlign="left">
                Text Spacing
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0} pb={4}>
            <LineHeight />
            <TextAlign />
            <TextTransform />
            <LetterSpacing />
            <Placeholder />
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
            <FontSmoothing />
            <FontStyle />
            <FontVariantNumeric />
            <ListStyle />
            <TextOverflow />
            <VerticalAlign />
            <WordBreak />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default TypographySection
