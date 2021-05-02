export interface IdParam {
  projectId: string
}

export interface ImportPayload extends IdParam {
  url: string
  path: string
  branch: string
}

export interface ElementPayload extends IdParam {
  codePosition: string
  tagName: string
  className: string
  selector: string
  text?: string
  display?: string
  position?: string
  parentTagName?: string
  parentDisplay?: string
}

export enum InsertMode {
  After = 'After',
  Before = 'Before',
  Append = 'Append',
  // Prepend = 'Prepend',
}

export enum InsertElementType {
  div = 'div',
  span = 'span',
  a = 'a',
  button = 'button',
  input = 'input',
}

export interface InsertElementPayload extends ElementPayload {
  insertElementType: InsertElementType
  insertMode?: InsertMode
}

export interface BreadcrumbPayload {
  projectId: string
  index: number
  isClick?: boolean
}

export interface JitTiggerPayload {
  projectId: string
  className: string
}

export enum MainIpcChannel {
  Shortcut = 'Shortcut',
  GetStore = 'GetStore',
  SetStore = 'SetStore',
  Controls = 'Controls',
  MainMenu = 'MainMenu',
  ProjectMenu = 'ProjectMenu',
  PagesMenu = 'PagesMenu',
  SelectDirs = 'SelectDirs',
  OpenDirs = 'OpenDirs',
  FrontView = 'FrontView',
  DestroyProjectView = 'DestroyProjectView',
  LoadURL = 'LoadURL',
  DeviceEmulation = 'DeviceEmulation',
  FocusElement = 'FocusElement',
  BlurElement = 'BlurElement',
  Flush = 'Flush',
  SelectBreadcrumb = 'SelectBreadcrumb',
  LiveUpdateClass = 'LiveUpdateClass',
  InsertTab = 'InsertTab',
  TextTab = 'TextTab',
}

export const Shortcuts = ['Alt+1', 'Alt+2', 'Alt+3', 'Alt+4', 'Alt+5', 'Alt+6', 'Alt+7', 'Alt+8', 'Alt+9']
