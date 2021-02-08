import React, { useEffect, useState, useCallback, useRef, ChangeEvent, Suspense, useReducer } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
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
import cs from 'classnames'
import { PuffLoader, BeatLoader, BarLoader } from 'react-spinners'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import Home from './Home'
import ProjectPage from './Project'
import TabBar from './components/TabBar'
import { send, listen } from './ipc'
import style from './App.module.scss'
import PreloadWindow from './preload_window'

declare const window: PreloadWindow

interface GitPayload {
  result?: string
  error?: string
}

interface CreateOutput {
  stdout?: string
  stderr?: string
  error?: string
  exited?: number
}

const App = (): JSX.Element => {
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const profileLoad = useStoreActions((actions) => actions.profile.load)
  const projectLoad = useStoreActions((actions) => actions.project.load)

  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)
  const modalDisclosure = useStoreState<boolean>((state) => state.project.modalDisclosure)
  const setModalClose = useStoreActions((actions) => actions.project.setModalClose)

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  const [url, setUrl] = useState('')
  const [path, setPath] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const output = useRef<Array<string>>([])

  useEffect(() => {
    // profileLoad()
    // projectLoad()
  }, [profileLoad, projectLoad])

  const openProject = useCallback(async () => {
    // setFrontProject()
    // todo...
  }, [])

  const submit = useCallback(async () => {
    if (projects.map((p) => p.url).includes(url)) {
      onOpenExistsAlert()
      return
    }
    setIsLoading(true)
    send('gitClone', { url, path })
    output.current = []
  }, [projects, url, path, onOpenExistsAlert])

  useEffect(() => {
    const unlisten = listen('gitClone', (payload: GitPayload) => {
      if (payload.result) {
        output.current.push(`gitClone:${payload.result}`)
        send('npmInstall', { cwd: path })
      } else if (payload.error) {
        output.current.push(`gitClone error:${payload.error}`)
      }
      forceUpdate()
    })
    return unlisten
  }, [path])

  useEffect(() => {
    const unlisten = listen('npmInstall', (payload: CreateOutput) => {
      if (payload.stdout) {
        output.current.push(`stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        output.current.push(`stderr:${payload.stderr}`)
      } else if (payload.error) {
        output.current.push(`error:${payload.error}`)
      } else if (payload.exited !== undefined) {
        output.current.push('exited.')
        setIsLoading(false)
      }
      forceUpdate()
    })
    return unlisten
  }, [])

  return (
    <div className="app">
      <TabBar />
      <div className={style.main}>
        {!frontProject && <Home />}
        {frontProject && (
          <Suspense fallback={<PuffLoader />}>
            <ProjectPage />
          </Suspense>
        )}
      </div>

      <Modal isOpen={modalDisclosure} onClose={setModalClose} scrollBehavior="inside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="30% 70%" gap={6}>
              <Box>
                <FormControl id="url" mt={4}>
                  <FormLabel>Url</FormLabel>
                  <Input
                    type="text"
                    value={url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  />
                  <FormHelperText>
                    If you don‘t know what this is, you can read{' '}
                    <a className="link" href="http://baidu.com">
                      our documentation
                    </a>{' '}
                    or ask the front-end engineer of the team for help
                  </FormHelperText>
                </FormControl>

                <FormControl id="path" mt={4}>
                  <FormLabel>Local Path</FormLabel>
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faFolderOpen} />}
                    colorScheme="gray"
                    onClick={(e) => {
                      e.stopPropagation()
                      const filePaths = window.selectDirs()
                      setPath(filePaths[0])
                    }}
                  >
                    Select Folder
                  </Button>
                  <Tooltip label={path} aria-label="path">
                    <Text color="gray.500" isTruncated>
                      {path}
                    </Text>
                  </Tooltip>
                </FormControl>

                <FormControl id="username" mt={4}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  />
                </FormControl>

                <FormControl id="password" mt={4}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <p style={{ whiteSpace: 'pre', overflowX: 'auto' }}>{output.current.join('\n')}</p>
                {isLoading && (
                  <p className={style.spinner}>
                    <BarLoader height={4} width={100} color="gray" />
                  </p>
                )}
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button variant="outline" mr={3} onClick={() => setModalClose()}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isLoading={isLoading}
              spinner={<BeatLoader size={8} color="teal" />}
              onClick={submit}
            >
              Create
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
            <Button colorScheme="red" ml={3} onClick={openProject}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default App
