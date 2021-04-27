import React, { useState, useCallback, useEffect } from 'react'
import { HStack, VStack, Textarea, Button, useToast } from '@chakra-ui/react'
import { ElementPayload } from '../../../interface'
import { Handler } from '../../../backend/backend.interface'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import type { PreloadWindow } from '../../../preload'

declare const window: PreloadWindow
const { sendBackIpc } = window.derealize

const Editor: React.FC = (): JSX.Element => {
  const toast = useToast()

  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const [text, setText] = useState<string | undefined>(element?.text)

  const handleInsert = useCallback(() => {
    if (!element) {
      toast({
        title: 'Element is not selected',
        status: 'error',
      })
      return
    }

    sendBackIpc(Handler.TextElement, { ...element, text } as any)
  }, [element, text, toast])

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
      <Button colorScheme="pink" onClick={handleInsert}>
        Update
      </Button>
    </VStack>
  )
}

export default Editor
