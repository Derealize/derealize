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
  DeviceEmulation = 'DeviceEmulation',
  LoadURL = 'LoadURL',
  CloseProjectView = 'CloseProjectView',
  FrontMain = 'FrontMain',
  FrontProjectWeb = 'FrontProjectWeb',
  OpenDirs = 'OpenDirs',
  SelectDirs = 'SelectDirs',
  PagesMenu = 'PagesMenu',
  ProjectMenu = 'ProjectMenu',
  MainMenu = 'MainMenu',
  Controls = 'Controls',
  GetStore = 'GetStore',
  SetStore = 'SetStore',
}
