/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react'
import { HStack, VStack, Select, Button, IconButton, Tooltip, useToast } from '@chakra-ui/react'
import { CgInsertAfterR, CgInsertBeforeR } from 'react-icons/cg'
import { BiAddToQueue } from 'react-icons/bi'
import { ElementPayload, InsertMode, InsertElementType, InsertElementPayload } from '../../interface'
import { Handler } from '../../backend/backend.interface'
import { useStoreActions, useStoreState } from '../../reduxStore'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

const Insert: React.FC = (): JSX.Element => {
  const toast = useToast()
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const [selInsertMode, setSelInsertMode] = useState(InsertMode.After)
  const [selElementType, setSelElementType] = useState(InsertElementType.div)

  const handleInsert = useCallback(() => {
    if (!element) {
      toast({
        title: 'Element is not selected',
        status: 'error',
      })
      return
    }

    const payload: InsertElementPayload = {
      ...element,
      insertMode: selInsertMode,
      insertElementType: selElementType,
    }
    sendBackIpc(Handler.InsertElement, payload as any)
  }, [element, selElementType, selInsertMode, toast])

  return (
    <VStack alignItems="stretch">
      <HStack>
        {Object.keys(InsertMode).map((value) => {
          let IconComponent = <CgInsertAfterR />
          switch (value) {
            case InsertMode.After:
              IconComponent = <CgInsertAfterR />
              break
            case InsertMode.Before:
              IconComponent = <CgInsertBeforeR />
              break
            case InsertMode.Append:
              IconComponent = <BiAddToQueue />
              break
            default:
              break
          }

          return (
            <Tooltip key={value} label={`${value} Current Element`}>
              <IconButton
                size="icon"
                aria-label={value}
                colorScheme={selInsertMode === value ? 'pink' : 'gray'}
                variant="outline"
                icon={IconComponent}
                onClick={() => setSelInsertMode(value as InsertMode)}
                _focus={{
                  boxShadow: 'outline',
                }}
              />
            </Tooltip>
          )
        })}
      </HStack>

      <Select
        placeholder="Element Type"
        value={selElementType}
        onChange={(e) => setSelElementType(e.target.value as InsertElementType)}
      >
        {Object.keys(InsertElementType).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>

      <Button colorScheme="pink" onClick={handleInsert}>
        Insert
      </Button>
    </VStack>
  )
}

export default Insert
