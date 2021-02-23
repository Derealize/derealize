import React, { useEffect, useState, useCallback, useRef, ChangeEvent, useReducer } from 'react'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { css } from '@emotion/react'
import { ProjectStage, Payload, ProcessPayload } from '../backend/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
import { send, listen } from '../ipc'
import style from './Import.module.scss'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

const gitUrlPattern = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\S]+:[\S]+@)?([\w.@:/\-~]+)(\.git)(\/)?/i

const ImportProject = (): JSX.Element => {
  const toast = useToast()
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()
  const { register, handleSubmit, watch, errors } = useForm()

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const modalDisclosure = useStoreState<boolean>((state) => state.project.modalDisclosure)
  const setModalClose = useStoreActions((actions) => actions.project.setModalClose)
  const setProject = useStoreActions((actions) => actions.project.setProject)
  const openProject = useStoreActions((actions) => actions.project.openProject)

  const [displayName, setDisplayName] = useState('')
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('derealize')
  const [path, setPath] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const output = useRef<Array<string>>([])

  useEffect(() => {
    setIsReady(false)
    if (!url) return
    try {
      const parseURL = new URL(url)
      setUsername(parseURL.username)
      setPassword(parseURL.password)

      const name = parseURL.pathname.substring(1).replace('.git', '').replaceAll('/', '-')
      setDisplayName(name)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }, [toast, url])

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
    setIsLoading(true)
    setIsReady(false)
    output.current = []
    send('Import', { url, path, branch })
  }, [projects, url, path, branch, onOpenExistsAlert])

  useEffect(() => {
    const unlisten = listen('import', (payload: Payload) => {
      if (payload.id !== url) return
      if (payload.result) {
        output.current.push(`import: ${payload.result}`)
      } else if (payload.error) {
        output.current.push(`import error:${payload.error}`)
        setIsLoading(false)
      }
      forceUpdate()
    })

    const npmUnlisten = listen('install', (payload: ProcessPayload) => {
      if (payload.id !== url) return
      if (payload.stdout) {
        output.current.push(`install stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        output.current.push(`install stderr:${payload.stderr}`)
      } else if (payload.error) {
        output.current.push(`install error:${payload.error}`)
      } else if (payload.exit !== undefined) {
        setIsLoading(false)
        setIsReady(true)
      }
      forceUpdate()
    })

    return () => {
      unlisten()
      npmUnlisten()
    }
  }, [path, url])

  useEffect(() => {
    if (isReady) {
      setProject({
        project: { url, path, displayName, editedTime: dayjs().toString(), runningOutput: [] },
      })
    }
  }, [setProject, displayName, isReady, url, path])

  const open = useCallback(async () => {
    if (isReady) {
      openProject(url)
    }
  }, [isReady, openProject, url])

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
                    disabled={isLoading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  />
                  <FormHelperText className="prose">
                    If you don‘t know what this is, you can read{' '}
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
                    leftIcon={<FontAwesomeIcon icon={faFolderOpen} />}
                    colorScheme="gray"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                      const filePaths = window.selectDirs()
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
                    disabled={isLoading}
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
                      disabled={isLoading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value)
                        updateUrl({ _password: e.target.value })
                      }}
                    />
                    <InputRightElement width={12} className={style.pwdright}>
                      {!showPassword && <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(true)} />}
                      {showPassword && <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(false)} />}
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="displayname" mt={4}>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setDisplayName(e.target.value)
                    }}
                  />
                </FormControl>

                <FormControl id="branch" mt={4} isInvalid={!!errors.branch}>
                  <FormLabel>Branch</FormLabel>
                  <Input
                    name="branch"
                    type="text"
                    value={branch}
                    colorScheme="gray"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setBranch(e.target.value)
                    }}
                  />
                  <FormHelperText>If you don&apos;t know what this means please don&apos;t edit it</FormHelperText>
                  {errors.branch && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>
              </Box>
              <Box>
                <p style={{ whiteSpace: 'pre', overflow: 'auto' }}>{output.current.join('\n')}</p>
                {isLoading && (
                  <p className={style.spinner}>
                    <BarLoader height={4} width={100} color="gray" />
                  </p>
                )}
              </Box>
            </Grid>
            {isReady && (
              <Text color="red.500" align="center">
                Congratulations, it looks like the project is ready to work.
              </Text>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {isReady && (
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
              variant={isReady ? 'outline' : 'solid'}
              isLoading={isLoading}
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

export default ImportProject
