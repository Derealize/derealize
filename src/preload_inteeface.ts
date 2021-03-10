// https://stackoverflow.com/a/45352250
export default interface PreloadWindow extends Window {
  env: {
    isDev: boolean
    isMac: boolean
    port: boolean
  }
  electron: {
    getSocketId: () => string
    ipcConnect: (id: string, func: (client: any) => void) => void
    getStore: (key: string) => any
    setStore: (payload: Record<string, unknown>) => void
    controls: (payload: string) => void
    popupMenu: (prijectId?: string) => void
    selectDirs: () => string
    openDirs: (payload: string) => void
    frontProjectView: (projectId?: string, lunchUrl?: string) => void
    closeProjectView: (projectId: string) => void
  }
}
