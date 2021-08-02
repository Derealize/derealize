import ipc from 'node-ipc'

export default (name: string, payload: unknown) => {
  // todo: emit() reports an error. For some reason, it may be that the @type/node-ipc version is not aligned
  ;(ipc.server as any).broadcast('message', JSON.stringify({ type: 'push', name, payload }))
}
