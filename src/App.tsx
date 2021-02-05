import React, { useEffect, useState, useCallback, useRef, ChangeEvent, Suspense } from 'react'
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
} from '@chakra-ui/react'
import cs from 'classnames'
import { PuffLoader, BeatLoader } from 'react-spinners'
import { css } from '@emotion/react'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import Home from './Home'
import ProjectPage from './Project'
import TabBar from './components/TabBar'
import { send, listen } from './ipc'
import style from './App.module.scss'

interface GitCloneOutput {
  result?: string
  error?: string
}

const App = (): JSX.Element => {
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()

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
  const [gitCloneOutput, setGitCloneOutput] = useState<string>('')

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
    setGitCloneOutput('')
  }, [projects, url, path, onOpenExistsAlert])

  useEffect(() => {
    const unlisten = listen('gitClone', (payload: GitCloneOutput) => {
      setIsLoading(false)
      if (payload.result) {
        setGitCloneOutput(`gitClone fine:${payload.result}`)
      } else if (payload.error) {
        setGitCloneOutput(`gitClone error:${payload.error}`)
      }
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

      <Modal isOpen={modalDisclosure} onClose={setModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="url" mt={4}>
              <FormLabel>Project Url</FormLabel>
              <Input type="text" value={url} onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)} />
            </FormControl>

            <FormControl id="path" mt={4}>
              <FormLabel>Project Path</FormLabel>
              <Input
                type="text"
                value={path}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPath(e.target.value)}
              />
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
              {/* <FormHelperText>至少6个字符，包含数字与字母</FormHelperText> */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={setModalClose}>
              Close
            </Button>
            <Button
              colorScheme="teal"
              isLoading={isLoading}
              spinner={<BeatLoader size={8} color="gray" />}
              onClick={submit}
            >
              Submit
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
