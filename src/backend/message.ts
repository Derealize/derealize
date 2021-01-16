/* eslint-disable no-console */
const send = (data: { message: string; error?: string }) => {
  if (process.send) {
    process.send(data)
  } else if (data.error) {
    console.error(data.message, data.error)
  } else {
    console.log(data.message)
  }
}

export default send
