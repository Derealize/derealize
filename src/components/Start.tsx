import React, { useCallback, useEffect, useState, ChangeEvent, useRef } from 'react'
import {
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Container,
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
import { FocusableElement } from '@chakra-ui/utils'
import { BeatLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from '../reduxStore'
import { Project } from '../models/project'
import { send, listen } from '../ipc'
import css from './Start.module.scss'

interface GitCloneOutput {
  result?: string
  error?: string
}

const Start = (): JSX.Element => {
  const toast = useToast()
  const existsAlertCancelRef = useRef<any>()
  const { isOpen: openExistsAlert, onOpen: onOpenExistsAlert, onClose: onCloseExistsAlert } = useDisclosure()

  const projects = useStoreState<Array<Project>>((state) => state.project.projects)
  const setFrontProject = useStoreActions((actions) => actions.project.setFrontProject)

  const [url, setUrl] = useState('')
  const [path, setPath] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [gitCloneOutput, setGitCloneOutput] = useState<string>('')

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

  const openProject = useCallback(async () => {
    const project = projects.find((p) => p.url === url)
    if (project) {
      setFrontProject(project)
      // todo...
    }
  }, [projects, url, setFrontProject])

  return (
    <Container maxW="md">
      <FormControl id="url" mt={4}>
        <FormLabel>Project Url</FormLabel>
        <Input type="text" value={url} onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)} />
      </FormControl>

      <FormControl id="path" mt={4}>
        <FormLabel>Project Path</FormLabel>
        <Input type="text" value={path} onChange={(e: ChangeEvent<HTMLInputElement>) => setPath(e.target.value)} />
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

      <Button
        mt={4}
        colorScheme="gray"
        isLoading={isLoading}
        spinner={<BeatLoader size={8} color="gray" />}
        onClick={submit}
      >
        Submit
      </Button>

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
    </Container>
  )
}

export default Start
