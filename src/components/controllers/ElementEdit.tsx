import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { HStack, VStack, Select, Button } from '@chakra-ui/react'
import { ElementTag } from '../../interface'
import { useStoreActions, useStoreState } from '../../reduxStore'
import { ElementState } from '../../models/element'

const ElementEdit: React.FC = (): JSX.Element => {
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const setActiveElementTag = useStoreActions((actions) => actions.element.setActiveElementTag)

  const elementType = useMemo(
    () => (element?.actualStatus?.tagName.toLowerCase() || ElementTag.div) as ElementTag,
    [element],
  )

  const [selElementType, setSelElementType] = useState(elementType)

  useEffect(() => {
    setSelElementType(elementType)
  }, [elementType])

  const handleReplace = useCallback(() => {
    if (!element) return
    setActiveElementTag({ projectId: element.projectId, tag: selElementType })
  }, [element, selElementType, setActiveElementTag])

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
          onChange={(e) => setSelElementType(e.target.value as ElementTag)}
        >
          {Object.keys(ElementTag).map((value) => (
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
