// https://stackoverflow.com/a/45352250
export default interface PreloadWindow extends Window {
  getSocketId: () => string
  ipcConnect: (id: string, func: (client: any) => void) => void
  getStore: (key: string) => any
  setStore: (payload: Record<string, unknown>) => void
  isDebug: boolean
}
