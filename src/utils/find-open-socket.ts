import ipc from 'node-ipc'

ipc.config.silent = true

const isSocketTaken = (name: string) => {
  return new Promise((resolve, reject) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on('error', () => {
        ipc.disconnect(name)
        resolve(false)
      })

      ipc.of[name].on('connect', () => {
        ipc.disconnect(name)
        resolve(true)
      })
    })
  })
}

export default async () => {
  let currentSocket = 1
  // console.log('checking', currentSocket)
  // eslint-disable-next-line no-await-in-loop
  while (await isSocketTaken(`derealize-${currentSocket}`)) {
    currentSocket += 1
    // console.log('checking', currentSocket)
  }
  // console.log('found socket', currentSocket)
  return `derealize-${currentSocket}`
}
