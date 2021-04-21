export interface ElementPayload {
  projectId: string
  codePosition: string
  tagName: string
  className: string
  selector: string
  display?: string
  position?: string
  parentTagName?: string
  parentDisplay?: string
}

export interface SelectPayload {
  projectId: string
  index: number
  isClick?: boolean
}

export enum MainIpcChannel {
  FocusElement = 'FocusElement',
  LiveUpdateClass = 'LiveUpdateClass',
  SelectElement = 'SelectElement',
}
