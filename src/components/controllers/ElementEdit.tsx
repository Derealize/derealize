import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { HStack, VStack, Select, Button } from '@chakra-ui/react'
import { ElementTagType, ReplaceElementPayload } from '../../interface'
import { Handler } from '../../backend/backend.interface'
import { useStoreActions, useStoreState } from '../../reduxStore'
import type { PreloadWindow } from '../../preload'
import { ElementState } from '../../models/project'

declare const window: PreloadWindow
const { sendBackIpc } = window.derealize

const ElementEdit: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementState | undefined>((state) => state.project.activeElement)

  const elementType = useMemo(
    () => (element?.actualStatus?.tagName.toLowerCase() || ElementTagType.div) as ElementTagType,
    [element],
  )

  const [selElementType, setSelElementType] = useState(elementType)

  useEffect(() => {
    setSelElementType(elementType)
  }, [elementType])

  const handleReplace = useCallback(() => {
    if (!element) return
    const payload: ReplaceElementPayload = { ...element, replaceTagType: selElementType }
    sendBackIpc(Handler.ReplaceElement, payload as any)
  }, [element, selElementType])

  // const handleDelete = useCallback(() => {
  //   if (!element) return
  //   sendBackIpc(Handler.ReplaceElement, { ...element } as any)
  // }, [element])

  if (!element) return <></>

  return (
    <VStack alignItems="stretch">
      <HStack>
        <Select
          placeholder="Element Type"
          value={selElementType}
          onChange={(e) => setSelElementType(e.target.value as ElementTagType)}
        >
          {Object.keys(ElementTagType).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
        <Button colorScheme="teal" variant="ghost" onClick={handleReplace}>
          Replace
        </Button>
      </HStack>

      {/* <Button colorScheme="pink" variant="ghost" onClick={handleDelete}>
        Delete
      </Button> */}
    </VStack>
  )
}

export default ElementEdit
