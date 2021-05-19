import React, { useEffect, useState, useCallback, useRef, ChangeEvent } from 'react'
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
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'

import FileUpload from './FileUpload'
import { Handler } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project, BackgroundImage } from '../models/project'
import style from './BackgroundImageModal.module.scss'
import type { PreloadWindow } from '../preload'
import { ThemeImagePayload } from '../interface'

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

  const onRemove = useCallback(
    async (key) => {
      if (!project) return
      const payload: ThemeImagePayload = { projectId: project.id, key }
      await sendBackIpc(Handler.ThemeRemoveImage, payload as any)
    },
    [project],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ image: FileList; name: string }>()

  const onAdd = handleSubmit(async (data) => {
    if (!project?.config?.assetsPublicPath) return
    console.log('data', data)
    const payload: ThemeImagePayload = {
      projectId: project.id,
      key: data.name,
      value: `url(${project?.config?.assetsPublicPath + data.image[0]})`,
    }
    await sendBackIpc(Handler.ThemeSetImage, payload as any)
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
                  <Image src={project?.config?.baseUrl + b.path} />
                  <Text>{b.name}</Text>
                  <CloseButton className={style.removeBtn} onClick={() => onRemove(b.name)} />
                </Flex>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <form onSubmit={onAdd}>
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
                  colorScheme="gray"
                />
                <FormErrorMessage>{errors.name && errors?.name.message}</FormErrorMessage>
              </FormControl>

              <Button colorScheme="teal" size="lg" variant="solid" type="submit" ml={6}>
                Add
              </Button>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Images
