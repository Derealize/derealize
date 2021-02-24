// https://stackoverflow.com/a/45352250
export default interface PreloadWindow extends Window {
  getSocketId: () => string
  ipcConnect: (id: string, func: (client: any) => void) => void
  getStore: (key: string) => any
  setStore: (payload: Record<string, unknown>) => void
  controls: (payload: string) => void
  popupMenu: () => void
  selectDirs: () => string
  frontProjectView: (url?: string, lunchUrl?: string) => void
  closeProjectView: (id: string) => void
  isDebug: boolean
  isMac: boolean
}
