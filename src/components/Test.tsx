import React, { useCallback, useEffect, useState, useRef, useReducer } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { useToast, FormControl, FormLabel, Input, FormHelperText, Container, Button } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { login } from '../services/api'
import { send, listen } from '../ipc'
import PreloadWindow from '../preload_window'

declare let window: PreloadWindow

interface NpmInstallOutput {
  stdout?: string
  stderr?: string
  error?: string
  exited?: number
}

interface GitCloneOutput {
  result?: string
  error?: string
}

const Test = (): JSX.Element => {
  const [factorial, setFactorial] = useState(0)
  const [ring, setRing] = useState('')
  const [test, setTest] = useState('')
  const npmInstallOutput = useRef<Array<string>>([])
  const [gitCloneOutput, setGitCloneOutput] = useState<string>('')

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    const unlisten = listen('npm_install', (payload: NpmInstallOutput) => {
      console.log(payload)
      if (payload.stdout) {
        npmInstallOutput.current.push(`stdout:${payload.stdout}`)
      } else if (payload.stderr) {
        npmInstallOutput.current.push(`stderr:${payload.stderr}`)
      } else if (payload.error) {
        npmInstallOutput.current.push(`error:${payload.error}`)
      } else if (payload.exited !== undefined) {
        npmInstallOutput.current.push('exited.')
      }
      forceUpdate()
    })
    return unlisten
  }, [])

  useEffect(() => {
    const unlisten = listen('git_clone', (payload: GitCloneOutput) => {
      console.log(payload)
      if (payload.result) {
        setGitCloneOutput(`clone fine:${payload.result}`)
      } else if (payload.error) {
        setGitCloneOutput(`clone error:${payload.error}`)
      }
    })
    return unlisten
  }, [])

  return (
    <div>
      <button
        id="factorial"
        type="button"
        onClick={async () => {
          const result = (await send('factorial', { num: 5 })) as number
          setFactorial(result)
        }}
      >
        Compute factorial
      </button>
      <p>factorial: {factorial}</p>

      <button
        id="call"
        type="button"
        onClick={async () => {
          let result = (await send('ring', { message: 'this is james' })) as string
          setRing(result)
        }}
      >
        Make phone call
      </button>
      <p>ring: {ring}</p>

      <button
        id="store"
        type="button"
        onClick={async () => {
          await window.setStore({ hello: 'world22' })
          const result = window.getStore('hello')
          setTest(result)
        }}
      >
        setStore
      </button>
      <p>test: {test}</p>

      <button
        id="git_clone"
        type="button"
        onClick={async () => {
          send('git_clone', {
            url: 'https://zicjin:z565656z#@github.com/zicjin/derealize-cra.git',
            path: 'D:\\work\\derealize-cra-test',
          })
          setGitCloneOutput('')
        }}
      >
        gitClone
      </button>
      <div>{gitCloneOutput}</div>

      <button
        id="npm_install"
        type="button"
        onClick={async () => {
          send('npm_install', { path: 'D:\\work\\derealize-cra-test' })
          npmInstallOutput.current = []
        }}
      >
        npmInstall
      </button>
      <div>
        {npmInstallOutput.current.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>

      <button
        id="npm_start"
        type="button"
        onClick={async () => {
          send('npm_start', { path: 'D:\\work\\derealize-cra-test', script: 'start' })
        }}
      >
        npmStart
      </button>
    </div>
  )
}

export default Test
