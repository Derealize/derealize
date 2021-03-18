import ipc from 'node-ipc'

export default (name: string, payload: unknown) => {
  // todo: emit()报错。不知为何，可能是 @type/node-ipc 版本没对齐
  ;(ipc.server as any).broadcast('message', JSON.stringify({ type: 'push', name, payload }))
}
