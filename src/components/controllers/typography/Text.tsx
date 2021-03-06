import React, { useState, useCallback, useEffect } from 'react'
import { VStack, Textarea, Button } from '@chakra-ui/react'
import type { ElementState } from '../../../models/element'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import { MainIpcChannel } from '../../../interface'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow
const { sendMainIpc } = window.derealize

const Text: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const setSelectedElementText = useStoreActions((actions) => actions.element.setSelectedElementText)

  const [text, setText] = useState<string | undefined>(element?.text)

  const handleInsert = useCallback(() => {
    if (!element || text === undefined) return
    const { projectId, selector } = element
    setSelectedElementText({ projectId, text })
    sendMainIpc(MainIpcChannel.LiveUpdateText, projectId, selector, text)
  }, [element, setSelectedElementText, text])

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
