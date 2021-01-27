import React, { useCallback, useEffect, useState, ChangeEvent } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { useToast, FormControl, FormLabel, Input, FormHelperText, Container, Button } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { login } from '../services/api'
import { send, listen } from '../ipc'
import css from './Start.module.scss'

const Start = (): JSX.Element => {
  const toast = useToast()

  const [giturl, setGiturl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const submit = useCallback(async () => {
    setIsLoading(true)
    await login(username, password, toast)
    setAuthed(true)
  }, [password, toast, username])

  useEffect(() => {
    login('zicjin@gmail.com', 'Airwheel2020', toast)
      .then(() => {
        setAuthed(true)
        return null
      })
      .catch(console.error)
  }, [toast])

  return (
    <Container maxW="md" mt={20}>
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
        提交
      </Button>
    </Container>
  )
}

export default Start
