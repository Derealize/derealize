/* eslint-disable react/jsx-props-no-spreading */
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
  Box,
  VStack,
  Tooltip,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { IoImageOutline } from 'react-icons/io5'

import FileUpload from './FileUpload'
import { Handler, TailwindConfigReply } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project, BackgroundImage } from '../models/project'
import style from './BackgroundImageModal.module.scss'
import type { PreloadWindow } from '../preload'
import { ThemeSetImagePayload, ThemeRemoveImagePayload } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc } = window.derealize

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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{ images: FileList; key: string }>()

  const watchImages = watch('images')

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

  const onAdd = handleSubmit(async (data, e) => {
    if (!project?.config?.assetsUrl || !data.images.length) return

    const { name, path } = data.images[0]

    const payload: ThemeSetImagePayload = {
      projectId: project.id,
      key: data.key,
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
      reset({ images: new DataTransfer().files, key: '' }) // https://stackoverflow.com/a/66105137/346701
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
            <Flex>
              <VStack alignItems="stretch" w="25%" pr={4}>
                <FormControl isInvalid={!!errors.images} isRequired>
                  <FileUpload register={register('images', { validate: validateFiles })}>
                    <Button leftIcon={<Icon as={IoImageOutline} />}>Select Image</Button>
                  </FileUpload>
                  {!!watchImages?.length && (
                    <Tooltip label={watchImages[0].path} aria-label="image">
                      <Text color="gray.500" isTruncated>
                        {watchImages[0].name}
                      </Text>
                    </Tooltip>
                  )}
                  <FormErrorMessage>{errors.images && errors?.images.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.key} isRequired>
                  <Input {...register('key', { required: true })} type="text" placeholder="image key name" />
                  <FormErrorMessage>{errors.key && errors?.key.message}</FormErrorMessage>
                </FormControl>

                <Button colorScheme="teal" size="lg" variant="ghost" type="submit" onClick={onAdd}>
                  Add
                </Button>
              </VStack>
              <Box w="75%">
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {backgroundImages.map((b) => (
                    <Flex key={b.name} direction="column" alignItems="center" className={style.imageItem}>
                      <Image src={project?.config?.baseUrl + b.webPath} />
                      <Text>{b.name}</Text>
                      <CloseButton className={style.removeBtn} onClick={() => onRemove(b)} />
                    </Flex>
                  ))}
                </Grid>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="gray" onClick={() => toggleModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Images
