import React, { useEffect, useState, useCallback } from 'react'
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormErrorMessage,
  Image,
  CloseButton,
  Input,
  Button,
  Flex,
  Text,
  Grid,
  Icon,
  HStack,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'

import FileUpload from './FileUpload'
import { Handler, TailwindConfigReply } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project, BackgroundImage } from '../models/project'
import style from './BackgroundImageModal.module.scss'
import type { PreloadWindow } from '../preload'
import { ThemeSetImagePayload, ThemeRemoveImagePayload } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync } = window.derealize

const validateFiles = (files: FileList) => {
  if (files.length < 1) {
    return 'Files is required'
  }
  let error
  Array.from(files).every((file) => {
    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 10
    if (fsMb > MAX_FILE_SIZE) {
      error = 'Max file size 10mb'
      return false
    }
    return true
  })

  return error || true
}

const Images = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const backgroundImages = useStoreState<BackgroundImage[]>((state) => state.project.backgroundImages)
  const modalDisclosure = useStoreState<boolean>((state) => state.project.backgroundsModalDisclosure)
  const toggleModal = useStoreActions((actions) => actions.project.toggleBackgroundsModal)
  const setTailwindConfig = useStoreActions((actions) => actions.project.setTailwindConfig)

  const onRemove = useCallback(
    async (b: BackgroundImage) => {
      if (!project || !project.config) return

      const payload: ThemeRemoveImagePayload = { projectId: project.id, key: b.name, webPath: b.webPath }
      const reply = (await sendBackIpc(Handler.ThemeRemoveImage, payload as any)) as TailwindConfigReply
      if (reply.error) {
        toast({
          title: `remove image error: ${reply.error}`,
          status: 'error',
        })
        return
      }

      if (reply.result) {
        setTailwindConfig({ projectId: project.id, config: reply.result })
      }
    },
    [project, setTailwindConfig, toast],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ image: FileList; name: string }>()

  const onAdd = handleSubmit(async (data) => {
    if (!project?.config?.assetsUrl) return
    // console.log('data', data)

    const { name, path } = data.image[0]

    const payload: ThemeSetImagePayload = {
      projectId: project.id,
      key: data.name,
      path,
      fileName: name,
    }
    const reply = (await sendBackIpc(Handler.ThemeSetImage, payload as any)) as TailwindConfigReply
    if (reply.error) {
      toast({
        title: `add image error: ${reply.error}`,
        status: 'error',
      })
      return
    }

    if (reply.result) {
      setTailwindConfig({ projectId: project.id, config: reply.result })
    }
  })

  return (
    <>
      <Modal isOpen={modalDisclosure} onClose={() => toggleModal(false)} scrollBehavior="outside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {backgroundImages.map((b) => (
                <Flex key={b.name} direction="column" alignItems="center" className={style.imageItem}>
                  <Image src={project?.config?.baseUrl + b.webPath} />
                  <Text>{b.name}</Text>
                  <CloseButton className={style.removeBtn} onClick={() => onRemove(b)} />
                </Flex>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <HStack spacing={2}>
              <FormControl isInvalid={!!errors.image} isRequired>
                <FileUpload register={register('image', { validate: validateFiles })}>
                  <Button leftIcon={<Icon as={FiFile} />}>Select Image</Button>
                </FileUpload>
                <FormErrorMessage>{errors.image && errors?.image.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name} isRequired>
                <Input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('name', { required: true })}
                  type="text"
                  placeholder="key-name"
                />
                <FormErrorMessage>{errors.name && errors?.name.message}</FormErrorMessage>
              </FormControl>

              <Button colorScheme="teal" size="lg" variant="ghost" type="submit" onClick={onAdd}>
                Add
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Images
