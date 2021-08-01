import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron'
import { MainIpcChannel, ControllerShortcut } from './interface'

const isDarwin = process.platform === 'darwin'
const isProd = process.env.NODE_ENV === 'production'
const isDebug = !isProd && process.env.DEBUG_PROD !== 'true'
const isStudio = process.env.STUDIO === 'true'

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

export default class MenuBuilder {
  mainWindow: BrowserWindow

  frontMainView: () => void

  loadURL: (projectId: string, url: string) => void

  checkForUpdates: () => Promise<void>

  about: () => void

  constructor(
    mainWindow: BrowserWindow,
    frontMainView: () => void,
    loadURL: (projectId: string, url: string) => void,
    checkForUpdates: () => Promise<void>,
    about: () => void,
  ) {
    this.mainWindow = mainWindow
    this.frontMainView = frontMainView
    this.loadURL = loadURL
    this.checkForUpdates = checkForUpdates
    this.about = about
  }

  buildMenu(): Menu {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment()
    }

    const menu = Menu.buildFromTemplate(isDarwin ? this.darwinTemplate() : this.template())
    Menu.setApplicationMenu(menu)
    return menu
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y)
          },
        },
      ]).popup({ window: this.mainWindow })
    })
  }

  buildPagesMenu(projectId: string, pages: Array<string>): Menu {
    const pagesTemplate = pages.map((page) => {
      return {
        label: page,
        click: () => {
          this.loadURL(projectId, page)
        },
      }
    })

    const menu = Menu.buildFromTemplate(pagesTemplate)
    return menu
  }

  template(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [
      {
        label: '&Project',
        submenu: [
          {
            label: '&Import',
            accelerator: 'Ctrl+I',
            click: () => {
              this.mainWindow.webContents.send(MainIpcChannel.OpenImport)
            },
          },
          {
            label: '&Flush Tailwindcss Config',
            accelerator: 'Ctrl+F',
            click: () => {
              this.mainWindow.webContents.send(MainIpcChannel.Flush)
            },
          },
          {
            label: '&Close Project',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.webContents.send(MainIpcChannel.CloseFrontProject)
            },
          },
          {
            label: '&Quit',
            accelerator: isDarwin ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit()
            },
          },
        ],
      },
    ]

    template.push({ type: 'separator' })

    template.push({
      label: '&Edit',
      submenu: [
        {
          label: '&Save',
          accelerator: isDarwin ? 'Cmd+S' : 'Ctrl+S',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.ElementShortcut, 'Save')
          },
        },
        {
          label: '&Undo',
          accelerator: isDarwin ? 'Cmd+Z' : 'Ctrl+Z',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.Shortcut, 'Undo')
          },
        },
        {
          label: '&Redo',
          accelerator: isDarwin ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.Shortcut, 'Redo')
          },
        },
        {
          label: '&Colors',
          accelerator: isDarwin ? 'Cmd+Shift+C' : 'Ctrl+Shift+C',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.Shortcut, 'Colors Manager')
          },
        },
      ],
    })

    template.push({
      label: 'Controllers',
      submenu: ControllerShortcut.map(({ key, label }) => {
        return {
          label,
          accelerator: key,
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.ControllerShortcut, key)
          },
        }
      }),
    })

    template.push({ type: 'separator' })

    const viewMenus: MenuItemConstructorOptions[] = [
      {
        label: 'History',
        accelerator: 'Ctrl+H',
        click: () => {
          this.mainWindow.webContents.send(MainIpcChannel.Shortcut, 'History')
        },
      },

      {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
        },
      },
      {
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click: () => {
          this.mainWindow.webContents.reload()
        },
      },
    ]

    if (isDebug) {
      viewMenus.push({
        label: 'Close All BrowserView',
        click: () => {
          this.frontMainView()
        },
      })
      viewMenus.push({
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: () => {
          this.mainWindow.webContents.toggleDevTools()
        },
      })
    }

    template.push({ label: '&View', submenu: viewMenus })

    template.push({
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://derealize.com/docs/intro/')
          },
        },
        {
          label: 'Discord Community',
          click: () => {
            shell.openExternal('https://discord.gg/2sqy5QeZXK')
          },
        },
        {
          label: 'Collect & Prioritize Feedback',
          click: () => {
            shell.openExternal('https://derealize-fider.herokuapp.com/')
          },
        },
        {
          label: 'Check For Update',
          click: () => {
            this.checkForUpdates()
          },
        },
        {
          label: 'Contact Us',
          click: () => {
            shell.openExternal('mailto:elliotreborn@gmail.com')
          },
        },
        {
          label: 'About',
          click: this.about,
        },
      ],
    })

    return template
  }

  darwinTemplate(): DarwinMenuItemConstructorOptions[] {
    const template: DarwinMenuItemConstructorOptions[] = [
      {
        label: 'Derealize',
        submenu: [
          {
            label: 'About Derealize',
            selector: 'orderFrontStandardAboutPanel:',
          },
          { type: 'separator' },
          { label: 'Services', submenu: [] },
          { type: 'separator' },
          {
            label: 'Hide Derealize',
            accelerator: 'Command+H',
            selector: 'hide:',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:',
          },
          { label: 'Show All', selector: 'unhideAllApplications:' },
          { type: 'separator' },
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:',
          },
          { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
          { label: 'Bring All to Front', selector: 'arrangeInFront:' },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              app.quit()
            },
          },
        ],
      },
    ]

    template.push({
      label: 'Project',
      submenu: [
        {
          label: 'Import',
          accelerator: 'Ctrl+I',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.OpenImport)
          },
        },
        {
          label: 'Flush Tailwindcss Config',
          accelerator: 'Ctrl+F',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.Flush)
          },
        },
        {
          label: 'Close Project',
          accelerator: 'Ctrl+W',
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.CloseFrontProject)
          },
        },
      ],
    })

    template.push({
      label: 'Controllers',
      submenu: ControllerShortcut.map(({ key, label }) => {
        return {
          label,
          accelerator: key,
          click: () => {
            this.mainWindow.webContents.send(MainIpcChannel.ControllerShortcut, key)
          },
        }
      }),
    })

    const viewMenus: MenuItemConstructorOptions[] = [
      {
        label: 'History',
        accelerator: 'Alt+Command+H',
        click: () => {
          this.mainWindow.webContents.send(MainIpcChannel.Shortcut, 'History')
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
        },
      },
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => {
          this.mainWindow.webContents.reload()
        },
      },
    ]

    if (isDebug) {
      viewMenus.push({
        label: 'Close All BrowserView',
        click: () => {
          this.frontMainView()
        },
      })
      viewMenus.push({
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this.mainWindow.webContents.toggleDevTools()
        },
      })
    }

    template.push({ label: '&View', submenu: viewMenus })

    template.push({
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://derealize.com/docs/intro/')
          },
        },
        {
          label: 'Discord Community',
          click: () => {
            shell.openExternal('https://discord.gg/2sqy5QeZXK')
          },
        },
        {
          label: 'Collect & Prioritize Feedback',
          click: () => {
            shell.openExternal('https://derealize-fider.herokuapp.com/')
          },
        },
        {
          label: 'Check For Update',
          click: () => {
            this.checkForUpdates()
          },
        },
        {
          label: 'Contact Us',
          click: () => {
            shell.openExternal('mailto:elliotreborn@gmail.com')
          },
        },
        {
          label: 'About',
          click: this.about,
        },
      ],
    })

    return template
  }
}
