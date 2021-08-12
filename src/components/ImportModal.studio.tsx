/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback, useRef, ChangeEvent } from 'react'
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
  InputGroup,
  InputRightElement,
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
  Grid,
  Box,
  Tooltip,
} from '@chakra-ui/react'
import { BeatLoader, BarLoader } from 'react-spinners'
import { FaRegFolderOpen, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import type { BoolReply } from '../backend/backend.interface'
import type { ImportPayloadStd } from '../interface'
import { Handler, ProjectStatus, Broadcast, ProcessPayload } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { ProjectStd } from '../models/project.interface'
import style from './ImportModal.module.scss'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync, listenBackIpc, unlistenBackIpc, listenMainIpc, unlistenMainIpc } =
  window.derealize

const gitUrlPattern = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\S]+:[\S]+@)?([\w.@:/\-~]+)(\.git)(\/)?/i

type Inputs = {
  url: string
  path: string
  username: string
  password: string
  displayname: string
  branch: string
}

const ImportProjectWithRuntim = (): JSX.Element => {
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

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  // const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const projectId = useStoreState<string | undefined>((state) => state.projectStd.importModalProjectId)
  const toggleModal = useStoreActions((actions) => actions.projectStd.toggleImportModal)

  const projects = useStoreState<Array<ProjectStd>>((state) => state.projectStd.projects)
  const addProject = useStoreActions((actions) => actions.projectStd.addProject)
  const removeProject = useStoreActions((actions) => actions.projectStd.removeProject)
  const openProject = useStoreActions((actions) => actions.projectStd.openProject)

  const watchUrl = watch('url')
  const watchPath = watch('path')
  const [showPassword, setShowPassword] = useState(false)

  const [importloading, setImportloading] = useState(false)
  const [installOutput, setInstallOutput] = useState<Array<string>>([])

  const isReady = useStoreState<boolean | undefined>((state) => !!projectId && state.projectStd.isReady(projectId))

  useEffect(() => {
    listenMainIpc(MainIpcChannel.OpenImport, () => {
      toggleModal(true)
    })

    return () => {
      unlistenMainIpc(MainIpcChannel.OpenImport)
    }
  }, [toggleModal])

  useEffect(() => {
    if (!watchUrl) return
    setInstallOutput([])

    try {
      const parseURL = new URL(watchUrl)
      setValue('username', parseURL.username)
      setValue('password', parseURL.password)

      const projectName = parseURL.pathname.substring(1).replace('.git', '').replaceAll('/', '-')
      setValue('displayname', projectName)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }, [setInstallOutput, setValue, toast, watchUrl])

  const updateUrl = useCallback(
    ({ _username, _password }) => {
      if (!watchUrl) return
      try {
        const parseURL = new URL(watchUrl)
        if (_username) parseURL.username = _username
        if (_password) parseURL.password = _password
        setValue('url', parseURL.href)
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
        })
      }
    },
    [setValue, toast, watchUrl],
  )

  const submit = useCallback(
    async (data) => {
      if (!projectId) return

      const { url, path, displayname: name, branch } = data
      if (projects.map((p) => p.url).includes(url)) {
        onOpenExistsAlert()
        return
      }

      setImportloading(true)

      const newProject: ProjectStd = {
        id: projectId,
        url,
        path,
        name,
        branch,
        editedTime: dayjs().toString(),
        status: ProjectStatus.Initialized,
      }
      addProject(newProject)

      const payload: ImportPayloadStd = { projectId, url, path, branch }
      const { result, error } = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply

      if (result) {
        await sendBackIpc(Handler.Install, { projectId })
      } else {
        setImportloading(false)
        installOutput.push(`import error: ${error}`)
        setInstallOutput(installOutput)
        removeProject(projectId)
      }
    },
    [projectId, projects, addProject, onOpenExistsAlert, installOutput, removeProject],
  )

  const open = useCallback(() => {
    if (isReady && projectId) {
      toggleModal(false)
      openProject(projectId)
    }
  }, [openProject, projectId, isReady, toggleModal])

  useEffect(() => {
    listenBackIpc(Broadcast.Installing, (payload: ProcessPayload) => {
      if (payload.error) {
        setImportloading(false)
        toast({
          title: `Installing error:${payload.error}`,
          status: 'error',
        })
        return
      }

      if (payload.stdout) {
        installOutput.push(`stdout: ${payload.stdout}`)
      } else if (payload.stderr) {
        installOutput.push(`stderr: ${payload.stderr}`)
      } else if (payload.exit !== undefined) {
        installOutput.push(`exit: ${payload.error}`)
        setImportloading(false)
      }
      setInstallOutput([...installOutput])
    })
    return () => unlistenBackIpc(Broadcast.Installing)
  }, [installOutput, toast])

  return (
    <>
      <Modal isOpen={!!projectId} onClose={() => toggleModal(false)} scrollBehavior="outside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Import Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="30% 70%" gap={6}>
              <Box>
                <FormControl id="path" mt={4} isInvalid={!!errors.path}>
                  <FormLabel>Local Path</FormLabel>
                  <Button
                    leftIcon={<FaRegFolderOpen />}
                    colorScheme="gray"
                    disabled={importloading}
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
                  <FormHelperText className="prose">
                    Before importing your project, please configure the project according to{' '}
                    <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                      the documentation
                    </a>
                  </FormHelperText>
                  {/* {!watchUrl && (
                    <FormHelperText>
                      If the derealize project already exists on the local disk, you can import it directly.
                    </FormHelperText>
                  )} */}
                </FormControl>

                <FormControl id="url" mt={4} isInvalid={!!errors.url}>
                  <FormLabel htmlFor="url">URL</FormLabel>
                  <Input
                    type="text"
                    {...register('url', { required: true, pattern: gitUrlPattern })}
                    disabled={importloading}
                  />
                  {/* <FormHelperText className="prose">
                    If you don&apos;t know what this is, you can read{' '}
                    <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                      the documentation
                    </a>{' '}
                    or ask the front-end engineer of the team for help.
                  </FormHelperText> */}
                  {errors.url && <FormErrorMessage>This field format is not match</FormErrorMessage>}
                </FormControl>

                <FormControl id="username" mt={4} isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username', { required: true })}
                    disabled={importloading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      // setValue('username', e.target.value)
                      updateUrl({ _username: e.target.value })
                    }}
                  />
                  {errors.username && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>

                  <InputGroup size="md">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: true })}
                      disabled={importloading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        // setValue('password', e.target.value)
                        updateUrl({ _password: e.target.value })
                      }}
                    />
                    <InputRightElement width={12} className={style.pwdright}>
                      {!showPassword && <FaRegEye onClick={() => setShowPassword(true)} />}
                      {showPassword && <FaRegEyeSlash onClick={() => setShowPassword(false)} />}
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="displayname" mt={4}>
                  <FormLabel>Display Name</FormLabel>
                  <Input type="text" {...register('displayname', { required: true })} disabled={importloading} />
                  {errors.displayname && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="branch" mt={4} isInvalid={!!errors.branch}>
                  <FormLabel>Git Branch</FormLabel>
                  <Input
                    {...register('branch', { required: true })}
                    type="text"
                    disabled={importloading}
                    defaultValue="derealize"
                    colorScheme="gray"
                  />
                  <FormHelperText>If you don&apos;t know what this means please don&apos;t change</FormHelperText>
                  {errors.branch && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>
              </Box>
              <Box>
                <p className={style.output}>{installOutput.join('\n')}</p>
                {importloading && (
                  <p className={style.spinner}>
                    <BarLoader height={4} width={100} color="gray" />
                  </p>
                )}
              </Box>
            </Grid>
            {isReady && (
              <Text color="teal.500" align="center">
                Congratulations, it looks like the project is ready to work.
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
                  Open &amp; Start Project
                </Button>
              </ButtonGroup>
            )}
            <Button
              colorScheme="teal"
              size="lg"
              variant={isReady ? 'outline' : 'solid'}
              isLoading={importloading}
              spinner={<BeatLoader size={8} color="teal" />}
              onClick={handleSubmit(submit)}
              ml={6}
            >
              Import {isReady && 'Again'}
            </Button>
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

export default ImportProjectWithRuntim
