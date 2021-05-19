import React, { ReactNode, useRef } from 'react'
import { InputGroup } from '@chakra-ui/react'
import { UseFormRegisterReturn } from 'react-hook-form'

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
}

// https://gist.github.com/Sqvall/23043a12a7fabf0f055198cb6ec39531
const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as { ref: (instance: HTMLInputElement | null) => void }

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        multiple={multiple || false}
        hidden
        accept={accept}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

FileUpload.defaultProps = {
  accept: 'image/*',
  multiple: false,
  children: [],
}

export default FileUpload
