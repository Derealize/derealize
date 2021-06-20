import React, { useState, useCallback, useEffect } from 'react'
import { VStack, Textarea, Button } from '@chakra-ui/react'
import type { ElementState } from '../../../models/element'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import { MainIpcChannel } from '../../../interface'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow
const { sendMainIpc } = window.derealize

const Text: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const setActiveElementText = useStoreActions((actions) => actions.element.setActiveElementText)

  const [text, setText] = useState<string | undefined>(element?.text)

  const handleInsert = useCallback(() => {
    if (!element || text === undefined) return
    const { projectId, selector } = element
    setActiveElementText({ projectId, text })
    sendMainIpc(MainIpcChannel.LiveUpdateText, projectId, selector, text)
  }, [element, setActiveElementText, text])

  useEffect(() => {
    setText(element?.actualStatus?.text)
  }, [element])

  if (element?.actualStatus?.text === undefined) return <></>

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
