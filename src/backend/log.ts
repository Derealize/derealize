/* eslint-disable no-console */
const log = (message: string, error?: string | Error) => {
  if (process.send) {
    // fork option stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    process.send({ message, error })
  } else if (error) {
    console.error(message, error)
  } else {
    console.log(message)
  }
}

export default log
