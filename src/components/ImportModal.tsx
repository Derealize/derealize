/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
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
  FormHelperText,
  FormLabel,
  Input,
  Button,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { FaRegFolderOpen } from 'react-icons/fa'
import type { BoolReply } from '../backend/backend.interface'
import type { ImportPayload } from '../interface'
import { Handler } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project } from '../models/project.interface'
import style from './ImportModal.module.scss'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel, TEMPLATES } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync, listenMainIpc, unlistenMainIpc } = window.derealize

type Inputs = {
  path: string
  displayname: string
}

const ImportModal = (): JSX.Element => {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const projectId = useStoreState<string | undefined>((state) => state.project.importModalProjectId)
  const toggleModal = useStoreActions((actions) => actions.project.toggleImportModal)

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const addProject = useStoreActions((actions) => actions.project.addProject)
  const removeProject = useStoreActions((actions) => actions.projectStd.removeProject)

  const watchPath = watch('path')

  useEffect(() => {
    listenMainIpc(MainIpcChannel.OpenImport, () => {
      toggleModal(true)
    })

    return () => {
      unlistenMainIpc(MainIpcChannel.OpenImport)
    }
  }, [toggleModal])

  const submit = useCallback(
    async (data) => {
      if (!projectId) return

      const { path, displayname } = data
      if (projects.some((p) => p.path === path)) {
        toast({
          title: `The path already exists in your project list.`,
          status: 'error',
        })
        return
      }

      addProject({
        id: projectId,
        path,
        name: displayname,
        editedTime: dayjs().toString(),
      })

      const payload: ImportPayload = { projectId, path }
      const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply

      if (!result) {
        removeProject(projectId)
        toast({
          title: `Import error:${error}`,
          status: 'error',
        })
      }
    },
    [projectId, projects, addProject, toast, removeProject],
  )

  return (
    <Modal isOpen={!!projectId} onClose={() => toggleModal(false)} scrollBehavior="outside" size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Import Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="path" mt={4} isInvalid={!!errors.path}>
            <FormHelperText className="prose">
              Before importing your git project, please configure the project according to{' '}
              <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                the documentation
              </a>
              .
            </FormHelperText>

            <FormLabel>Local Path</FormLabel>
            <Button
              leftIcon={<FaRegFolderOpen />}
              colorScheme="gray"
              onClick={(e) => {
                e.stopPropagation()
                const filePaths = sendMainIpcSync(MainIpcChannel.SelectDirs)
                setValue('path', filePaths[0])
              }}
            >
              Select Folder
            </Button>
            <Input type="hidden" {...register('path', { required: true })} />
            <Tooltip label={watchPath} aria-label="path">
              <Text color="gray.500" isTruncated>
                {watchPath}
              </Text>
            </Tooltip>

            {errors.path && <FormErrorMessage>This field is required</FormErrorMessage>}
          </FormControl>

          <FormControl id="displayname" mt={4}>
            <FormLabel>Display Name</FormLabel>
            <Input type="text" {...register('displayname', { required: true })} />
            {errors.displayname && <FormErrorMessage>This field is required</FormErrorMessage>}
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="teal"
            size="lg"
            variant="solid"
            spinner={<BeatLoader size={8} color="teal" />}
            onClick={handleSubmit(submit)}
            ml={6}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ImportModal
