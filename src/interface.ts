export interface ElementPayload {
  projectId: string
  codePosition: string
  tagName: string
  className: string
  selector: string
  useShift?: boolean
  display?: string
  position?: string
  parentTagName?: string
  parentDisplay?: string
}

export enum MainIpcChannel {
  FocusElement = 'FocusElement',
  LiveUpdateClass = 'LiveUpdateClass',
}
