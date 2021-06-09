import React, { useState, useCallback, useEffect } from 'react'
import { VStack, Textarea, Button } from '@chakra-ui/react'
import type { ElementState } from '../../../models/element'
import { useStoreActions, useStoreState } from '../../../reduxStore'

const Text: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const setActiveElementText = useStoreActions((actions) => actions.element.setActiveElementText)

  const [text, setText] = useState<string | undefined>(element?.text)

  const handleInsert = useCallback(() => {
    if (!element || text === undefined) return
    setActiveElementText({ projectId: element.projectId, text })
  }, [element, setActiveElementText, text])

  useEffect(() => {
    setText(element?.text)
  }, [element])

  if (element?.text === undefined) return <></>

  return (
    <VStack alignItems="stretch">
      <Textarea
        placeholder="input element text"
        resize="vertical"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <Button colorScheme="pink" variant="ghost" onClick={handleInsert}>
        Update
      </Button>
    </VStack>
  )
}

export default Text
