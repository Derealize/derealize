/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback, useRef } from 'react'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
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
  ButtonGroup,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
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
import { MainIpcChannel } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync, listenMainIpc, unlistenMainIpc } = window.derealize

type Inputs = {
  path: string
  displayname: string
}

const ImportProject = (): JSX.Element => {
  const toast = useToast()
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const modalDisclosure = useStoreState<boolean>((state) => state.project.importModalDisclosure)
  const toggleModal = useStoreActions((actions) => actions.project.toggleImportModal)

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const addProject = useStoreActions((actions) => actions.project.addProject)
  const removeProject = useStoreActions((actions) => actions.project.removeProject)
  const openProject = useStoreActions((actions) => actions.project.openProject)
  const [isReady, setIsReady] = useState<boolean>(false)

  const watchPath = watch('path')
  const [projectId, setProjectId] = useState('')

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
      const { path, displayname: name } = data
      if (projects.map((p) => p.path).includes(path)) {
        onOpenExistsAlert()
        return
      }

      const id = nanoid()
      setProjectId(id)

      const newProject: Project = {
        id,
        path,
        name,
        editedTime: dayjs().toString(),
      }
      addProject(newProject)

      const payload: ImportPayload = { projectId: id, path }
      const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
      console.log('setIsReady', result)
      setIsReady(result)

      if (!result) {
        removeProject(id)
        toast({
          title: `Import error:${error}`,
          status: 'error',
        })
      }
    },
    [projects, addProject, onOpenExistsAlert, removeProject, toast],
  )

  const open = useCallback(() => {
    if (isReady && projectId) {
      toggleModal(false)
      openProject(projectId)
    }
  }, [openProject, projectId, isReady, toggleModal])

  return (
    <>
      <Modal isOpen={modalDisclosure} onClose={() => toggleModal(false)} scrollBehavior="outside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Import Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="path" mt={4} isInvalid={!!errors.path}>
              <FormHelperText className="prose">
                Before importing your project, please follow{' '}
                <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                  our documentation
                </a>{' '}
                to complete the project configuration.
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

            {isReady && (
              <Text color="teal.500" align="center" mt={4} px={20}>
                Congratulations, it looks like the project is ready to work. Before opening the project in Derealize,
                please run the development mode of the project yourself (e.g. &apos;yarn dev&apos;).
              </Text>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {isReady && (
              <ButtonGroup variant="outline" size="lg" spacing={6}>
                <Button colorScheme="gray" onClick={() => toggleModal(false)}>
                  Close Dialog
                </Button>
                <Button colorScheme="teal" onClick={open}>
                  Open Project
                </Button>
              </ButtonGroup>
            )}
            {!isReady && (
              <Button
                colorScheme="teal"
                size="lg"
                variant={isReady ? 'outline' : 'solid'}
                spinner={<BeatLoader size={8} color="teal" />}
                onClick={handleSubmit(submit)}
                ml={6}
              >
                Import
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={existsAlertCancelRef}
        onClose={onCloseExistsAlert}
        isOpen={openExistsAlert}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Project already exists</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Do you want to open this project now?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={existsAlertCancelRef} onClick={onCloseExistsAlert}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={open}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ImportProject
