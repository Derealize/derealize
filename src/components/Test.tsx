import React, { useEffect, useState, useRef, useReducer } from 'react'
import { send, listen } from '../ipc'
import PreloadWindow from '../preload_window'

declare const window: PreloadWindow

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
  const [test, setTest] = useState('')
  const npmInstallOutput = useRef<Array<string>>([])
  const [gitCloneOutput, setGitCloneOutput] = useState<string>('')
  const [gitOpenOutput, setGitOpenOutput] = useState<string>('')
  const [gitSyncOutput, setGitSyncOutput] = useState<string>('')
  const [gitPullOutput, setGitPullOutput] = useState<string>('')

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    const unlisten = listen('npmInstall', (payload: NpmInstallOutput) => {
      // console.log(payload)
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
    const unlisten = listen('gitClone', (payload: GitCloneOutput) => {
      // console.log(payload)
      if (payload.result) {
        setGitCloneOutput(`gitClone fine:${payload.result}`)
      } else if (payload.error) {
        setGitCloneOutput(`gitClone error:${payload.error}`)
      }
    })
    return unlisten
  }, [])

  return (
    <div>
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
        id="gitClone"
        type="button"
        onClick={async () => {
          send('gitClone', {
            url: 'https://zicjin:z565656z%23@github.com/zicjin/derealize-demo.git',
            path: 'D:\\derealize-demo-temp',
          })
          setGitCloneOutput('')
        }}
      >
        gitClone
      </button>
      <div>{gitCloneOutput}</div>

      <button
        id="gitOpen"
        type="button"
        onClick={async () => {
          send('gitOpen', {
            path: 'D:\\derealize-demo-temp',
          })
          setGitOpenOutput('')
        }}
      >
        gitOpen
      </button>
      <div>{gitOpenOutput}</div>

      <button
        id="gitSync"
        type="button"
        onClick={async () => {
          send('gitSync', {
            path: 'D:\\derealize-demo-temp',
            msg: 'test.tsx',
          })
          setGitSyncOutput('')
        }}
      >
        gitSync
      </button>
      <div>{gitSyncOutput}</div>

      <button
        id="gitPull"
        type="button"
        onClick={async () => {
          send('gitPull', {
            path: 'D:\\derealize-demo-temp',
          })
          setGitPullOutput('')
        }}
      >
        gitPull
      </button>
      <div>{gitPullOutput}</div>

      <button
        id="npmInstall"
        type="button"
        onClick={async () => {
          send('npmInstall', { cwd: 'D:\\work\\derealize-demo-temp' })
          npmInstallOutput.current = []
        }}
      >
        npmInstall
      </button>
      <div style={{ whiteSpace: 'pre' }}>{npmInstallOutput.current.join('\n')}</div>

      <button
        id="npmStart"
        type="button"
        onClick={async () => {
          send('npmStart', { cwd: 'D:\\work\\derealize-demo-temp', script: 'start' })
        }}
      >
        npmStart
      </button>
    </div>
  )
}

export default Test
