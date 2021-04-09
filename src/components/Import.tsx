import React, { useEffect, useState, useCallback, useRef, ChangeEvent, useMemo, useReducer } from 'react'
import dayjs from 'dayjs'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
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
import { css } from '@emotion/react'
import type { BoolReply } from '../backend/backend.interface'
import { Handler, ProjectStage } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project, ProjectView } from '../models/project'
import style from './Import.module.scss'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { send, selectDirs } = window.derealize

const gitUrlPattern = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\S]+:[\S]+@)?([\w.@:/\-~]+)(\.git)(\/)?/i

const ImportProject = (): JSX.Element => {
  const toast = useToast()
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()
  const { register, handleSubmit, watch, errors } = useForm()

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  // const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const modalDisclosure = useStoreState<boolean>((state) => state.project.modalDisclosure)
  const setModalClose = useStoreActions((actions) => actions.project.setModalClose)
  const loading = useStoreState<boolean>((state) => state.project.importloading)
  const setLoading = useStoreActions((actions) => actions.project.setImportLoading)

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const setProject = useStoreActions((actions) => actions.project.setProject)
  const addProject = useStoreActions((actions) => actions.project.addProject)
  const openProject = useStoreActions((actions) => actions.project.openProject)

  const installOutput = useStoreState<Array<string>>((state) => state.project.installOutput)
  const setInstallOutput = useStoreActions((actions) => actions.project.setInstallOutput)

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('derealize')
  const [path, setPath] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const project = useMemo(() => projects.find((p) => p.url === url), [projects, url])
  const readyOpen = project?.stage === ProjectStage.Ready

  useEffect(() => {
    if (project) {
      setProject({ ...project, stage: ProjectStage.Initialized })
    }

    if (!url) return

    try {
      const parseURL = new URL(url)
      setUsername(parseURL.username)
      setPassword(parseURL.password)

      const projectName = parseURL.pathname.substring(1).replace('.git', '').replaceAll('/', '-')
      setName(projectName)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }, [project, setProject, toast, url])

  const updateUrl = useCallback(
    ({ _username, _password }) => {
      if (!url) return
      try {
        const parseURL = new URL(url)
        if (_username) parseURL.username = _username
        if (_password) parseURL.password = _password
        setUrl(parseURL.href)
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
        })
      }
    },
    [toast, url],
  )

  const submit = useCallback(async () => {
    if (projects.map((p) => p.url).includes(url)) {
      onOpenExistsAlert()
      return
    }

    const newProject: Project = {
      url,
      path,
      name,
      editedTime: dayjs().toString(),
      stage: ProjectStage.Initialized,
      installOutput: [],
    }
    addProject(newProject)

    setLoading(true)
    const { result, error } = (await send(Handler.Import, { url, path, branch })) as BoolReply

    if (result) {
      send(Handler.Install, { url, path, branch })
      newProject.tailwindConfig = (await send(Handler.GetTailwindConfig, { url })) as TailwindConfig
    } else {
      newProject.installOutput?.push(`import error: ${error}`)
      setInstallOutput(newProject.installOutput || [])
    }
  }, [projects, url, path, name, addProject, setInstallOutput, setLoading, branch, onOpenExistsAlert])

  const open = useCallback(() => {
    if (readyOpen) {
      setModalClose()
      openProject(url)
    }
  }, [openProject, readyOpen, setModalClose, url])

  return (
    <>
      <Modal isOpen={modalDisclosure} onClose={setModalClose} scrollBehavior="outside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Import Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="30% 70%" gap={6}>
              <Box>
                <FormControl id="url" mt={4} isInvalid={!!errors.url}>
                  <FormLabel htmlFor="url">URL</FormLabel>
                  <Input
                    name="url"
                    type="text"
                    value={url}
                    ref={register({ required: true, pattern: gitUrlPattern })}
                    disabled={loading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  />
                  <FormHelperText className="prose">
                    If you don&apos;t know what this is, you can read{' '}
                    <a href="http://baidu.com" target="_blank" rel="noreferrer">
                      our documentation
                    </a>{' '}
                    or ask the front-end engineer of the team for help.
                  </FormHelperText>
                  {errors.url && <FormErrorMessage>This field format is not match</FormErrorMessage>}
                </FormControl>

                <FormControl id="path" mt={4} isInvalid={!!errors.path}>
                  <FormLabel>Local Path</FormLabel>
                  <Button
                    leftIcon={<FaRegFolderOpen />}
                    colorScheme="gray"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation()
                      const filePaths = selectDirs()
                      setPath(filePaths[0])
                    }}
                  >
                    Select Folder
                  </Button>
                  <Input name="path" type="hidden" value={path} ref={register({ required: true })} />
                  <Tooltip label={path} aria-label="path">
                    <Text color="gray.500" isTruncated>
                      {path}
                    </Text>
                  </Tooltip>

                  {errors.path && <FormErrorMessage>This field is required</FormErrorMessage>}
                  {!url && (
                    <FormHelperText>
                      If the derealize project already exists on the local disk, you can import it directly.
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl id="username" mt={4} isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    type="text"
                    value={username}
                    ref={register({ required: true })}
                    disabled={loading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value)
                      updateUrl({ _username: e.target.value })
                    }}
                  />
                  {errors.username && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>

                  <InputGroup size="md">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      disabled={loading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value)
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
                  <Input
                    type="text"
                    value={name}
                    disabled={loading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value)
                    }}
                  />
                </FormControl>

                <FormControl id="branch" mt={4} isInvalid={!!errors.branch}>
                  <FormLabel>Git Branch</FormLabel>
                  <Input
                    name="branch"
                    type="text"
                    disabled={loading}
                    value={branch}
                    colorScheme="gray"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setBranch(e.target.value)
                    }}
                  />
                  <FormHelperText>If you don&apos;t know what this means please don&apos;t change</FormHelperText>
                  {errors.branch && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>
              </Box>
              <Box>
                <p className={style.output}>{installOutput.join('\n')}</p>
                {loading && (
                  <p className={style.spinner}>
                    <BarLoader height={4} width={100} color="gray" />
                  </p>
                )}
              </Box>
            </Grid>
            {readyOpen && (
              <Text color="teal.500" align="center">
                Congratulations, it looks like the project is ready to work.
              </Text>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {readyOpen && (
              <ButtonGroup variant="outline" size="lg" spacing={6}>
                <Button colorScheme="gray" onClick={() => setModalClose()}>
                  Close Dialog
                </Button>
                <Button colorScheme="teal" onClick={open}>
                  Open Project
                </Button>
              </ButtonGroup>
            )}
            <Button
              colorScheme="teal"
              size="lg"
              variant={readyOpen ? 'outline' : 'solid'}
              isLoading={loading}
              spinner={<BeatLoader size={8} color="teal" />}
              onClick={handleSubmit(submit)}
              ml={6}
            >
              Import {readyOpen && 'Again'}
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

export default ImportProject
