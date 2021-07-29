/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { fork, ChildProcess, Serializable } from 'child_process'
import path from 'path'
import fs from 'fs'
import { app, BrowserWindow, BrowserView, shell, ipcMain, dialog, Menu } from 'electron'
import log from 'electron-log'
import * as Sentry from '@sentry/electron'
import semver from 'semver'
import fetch from 'node-fetch'
import type { AlertStatus } from '@chakra-ui/react'
import findOpenSocket from './utils/find-open-socket'
import MenuBuilder from './menu'
import store from './store'
import { ElementPayload, ElementActualStatus, BreadcrumbPayload, MainIpcChannel, ElementTag } from './interface'
import { version } from './package.json'

const isDarwin = process.platform === 'darwin'
const isProd = process.env.NODE_ENV === 'production'
const isDebugProd = process.env.DEBUG_PROD === 'true'
const isDev = !isProd && !isDebugProd
const isStudio = process.env.STUDIO === 'true'
let socketId: string
const mainLog = log.scope('main')

// https://stackoverflow.com/questions/44658269/electron-how-to-allow-insecure-https#comment94540289_50419166
app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true')

Sentry.init({ dsn: 'https://372da8ad869643a094b8c6de605093f7@o931741.ingest.sentry.io/5880650', enableNative: true })

Sentry.setContext('character', {
  runtime: 'main',
  isStudio,
  version,
})

process.on('uncaughtException', (err) => {
  // log.error('Main UncaughtException', err)
  Sentry.captureException(err)
  dialog.showMessageBox({
    type: 'error',
    title: 'Sorry',
    message: 'Uncaught exception occurred',
    detail: err.message,
  })
})

if (isDev) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()

  require('electron-debug')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(mainLog.error)
}

let menuBuilder: MenuBuilder | null = null
let mainWindow: BrowserWindow | null = null
let mainMenu: Menu | null = null
// let projectMenu: Menu | undefined
let pagesMenu: Menu | undefined

const checkForUpdates = async (silent = false) => {
  const resp = await fetch('https://cdn.socode.pro/latest.json', {
    headers: {
      'content-type': 'application/json',
    },
  })
  if (resp.ok) {
    const matrix = await resp.json()
    let latest = isStudio ? matrix.win_studio : matrix.win
    if (isDarwin) {
      latest = isStudio ? matrix.mac_studio : matrix.mac
    }
    if (semver.gt(latest, version)) {
      const { response } = await dialog.showMessageBox({
        message: 'The updated version is available for download. Sure to download?',
        buttons: ['Yes', 'Cancel'],
      })
      if (response === 0) {
        await shell.openExternal(
          `https://cdn.socode.pro/Derealize${isStudio ? '-studio' : ''}-${latest}.${isDarwin ? 'dmg' : 'exe'}`,
        )
      }
    } else if (!silent) {
      mainWindow?.webContents.send(MainIpcChannel.Toast, 'Already the latest version', 'success' as AlertStatus)
    }
  } else if (!silent) {
    mainWindow?.webContents.send(
      MainIpcChannel.Toast,
      `check update request fail:${resp.statusText}`,
      'warning' as AlertStatus,
    )
  }
}

const about = async () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'About',
    message: `Derealize${isStudio ? ' Studio' : ''}`,
    detail: `version: ${version}`,
  })
}

const topbarHeight = 42
const setBrowserViewBounds = (mainwin: BrowserWindow) => {
  const browserView = mainwin.getBrowserView()
  if (!browserView) return

  const barwidth = (store.get('barWidth') as number) || 300
  const rectangle = mainwin.getBounds()
  const xaxis = barwidth + 5
  const yaxis = (mainwin.isMaximized() ? 34 : 46) + topbarHeight + 1
  browserView.setBounds({ x: xaxis, y: yaxis, width: rectangle.width - xaxis, height: rectangle.height - yaxis })
}

interface ProjectHost {
  view: BrowserView
  baseUrl: string
  pages: Array<string>
  isWeapp: boolean
  loadFail?: boolean
  activeSelector?: string
}

const projects = new Map<string, ProjectHost>()

const frontMain = () => {
  if (!mainWindow) return
  projects.forEach((p) => mainWindow?.removeBrowserView(p.view))
}

ipcMain.on(
  MainIpcChannel.FrontView,
  (event: any, projectId: string | null, baseUrl: string, pages: Array<string>, isWeapp: boolean) => {
    if (!mainWindow) return
    if (!projectId) {
      frontMain()
      return
    }

    const project = projects.get(projectId)
    if (project) {
      mainWindow.setBrowserView(project.view)
    } else {
      const view = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          enableRemoteModule: false,
          contextIsolation: true,
          preload: path.resolve(__dirname, isProd ? 'preload-inject.prod.js' : 'preload-inject.js'),
          allowRunningInsecureContent: true,
        },
      })
      view.setBackgroundColor('#fff') // todo: invalid

      projects.set(projectId, { view, baseUrl, pages, isWeapp })
      mainWindow.setBrowserView(view)
      setBrowserViewBounds(mainWindow)
      if (isDev) {
        view.webContents.openDevTools()
      }

      // view.webContents.loadURL(baseUrl)
      view.webContents
        .on('did-start-loading', () => {
          const pj = projects.get(projectId)
          if (!pj) return
          pj.loadFail = undefined
          mainWindow?.webContents.send(MainIpcChannel.LoadStart, projectId)
        })
        .on('did-finish-load', (e: any) => {
          const pj = projects.get(projectId)
          if (!pj || pj.loadFail) return
          pj.view.webContents.send(MainIpcChannel.LoadFinish, socketId, projectId, isWeapp, pj.activeSelector)
          mainWindow?.webContents.send(MainIpcChannel.LoadFinish, projectId, true)
        })
        .on('did-fail-load', () => {
          const pj = projects.get(projectId)
          if (!pj) return
          pj.loadFail = true
          mainWindow?.webContents.send(MainIpcChannel.LoadFinish, projectId, false)
        })
        .on('page-favicon-updated', (e: any, favicons: string[]) => {
          mainWindow?.webContents.send(MainIpcChannel.Favicon, projectId, favicons[0])
        })
    }

    // projectMenu = menuBuilder?.buildProjectMenu(projectId)
    pagesMenu = menuBuilder?.buildPagesMenu(projectId, pages)
  },
)

ipcMain.on(MainIpcChannel.DeviceEmulation, (event, projectId: string, swidth: number) => {
  const project = projects.get(projectId)
  if (project) {
    const rectangle = project.view.getBounds()
    const width = swidth === 0 ? rectangle.width : swidth
    project.view.webContents.enableDeviceEmulation({
      screenPosition: swidth === 0 ? 'desktop' : 'mobile',
      screenSize: { width, height: rectangle.height },
      viewSize: { width, height: rectangle.height },
      viewPosition: { x: 0, y: 0 },
      deviceScaleFactor: 0,
      scale: 1,
    })
  }
})

const loadURL = (projectId: string, url: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.loadURL(path.join(project.baseUrl, url))
  }
}

ipcMain.on(MainIpcChannel.LoadURL, (event, projectId: string, url: string) => {
  loadURL(projectId, url)
})

ipcMain.on(MainIpcChannel.DestroyProjectView, (event, projectId: string) => {
  if (!mainWindow) return

  // https://github.com/electron/electron/pull/23578
  const project = projects.get(projectId)
  if (project) {
    mainWindow.removeBrowserView(project.view)
    ;(project.view.webContents as any).destroy()
  }
  projects.delete(projectId)
})

const sendIsMaximized = () => {
  if (!mainWindow) return
  mainWindow.webContents.send('isMaximized', mainWindow.isMaximized())
  setBrowserViewBounds(mainWindow)
}

const createWindow = async () => {
  // if (isDev) {
  //   await installExtensions()
  // }

  const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    icon: isStudio ? getAssetPath('icon.studio.png') : getAssetPath('icon.png'),
    frame: false,
    // autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, isProd ? 'preload.prod.js' : 'preload.js'),
    },
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('mainWindow is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }

    mainWindow.webContents.send('setParams', socketId)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  menuBuilder = new MenuBuilder(mainWindow, frontMain, loadURL, checkForUpdates, about)
  mainMenu = menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater()

  mainWindow.on('maximize', sendIsMaximized)
  mainWindow.on('unmaximize', sendIsMaximized)
  mainWindow.on('resize', () => {
    if (!mainWindow) return
    setBrowserViewBounds(mainWindow)
  })
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (isDarwin) {
    app.quit()
  }
})

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll()
// })

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

let backendProcess: ChildProcess
const createBackendProcess = () => {
  if (process.env.BACKEND_SUBPROCESS === 'true') {
    backendProcess = fork(
      path.join(__dirname, 'backend/backend.ts'),
      ['--subprocess', socketId, '--version', version],
      {
        execArgv: ['-r', './.derealize/scripts/BabelRegister'],
      },
    )
  } else if (isProd) {
    backendProcess = fork(path.join(__dirname, 'backend.prod.js'), ['--subprocess', socketId, '--version', version], {
      stdio: isDebugProd ? ['ignore', fs.openSync('./out.log', 'a'), fs.openSync('./err.log', 'a'), 'ipc'] : 'pipe',
    })
  } else {
    // nodegit 还未支持non-context-aware, 希望未来支持
    // https://github.com/electron/electron/issues/18397#issuecomment-583221969
    // 这种特殊的调试模式好像也和RendererProcessReuse不兼容
    app.allowRendererProcessReuse = false

    const backendWin = new BrowserWindow({
      x: 400,
      y: 400,
      width: 1000,
      height: 800,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })
    backendWin.loadURL(`file://${__dirname}/backend/backend.html`)
    backendWin.webContents.openDevTools()

    backendWin.webContents.on('did-finish-load', () => {
      backendWin.webContents.send('setParams', { socketId })
    })
  }

  if (backendProcess) {
    backendProcess
      .on('message', (message: Serializable) => {
        mainLog.info('backend ipc', message)
      })
      .on('error', (err) => {
        mainLog.error('backend ipc err', err)
        if (isProd) Sentry.captureException(err)
      })
  }
}

ipcMain.on(MainIpcChannel.GetStore, (event, key: string) => {
  const value = store.get(key)
  event.returnValue = value
  // event.sender.send(`getStore-${key}`, value) // contextBridge getStoreAsync()
})

ipcMain.on(MainIpcChannel.SetStore, (event, payload: Record<string, unknown>) => {
  store.set(payload)
})

ipcMain.on(MainIpcChannel.Controls, (event, payload: string) => {
  if (!mainWindow) return
  switch (payload) {
    case 'minimize':
      mainWindow.minimize()
      break
    case 'maximize':
      mainWindow.maximize()
      break
    case 'unmaximize':
      mainWindow.unmaximize()
      break
    case 'close':
      // mainWindow.close()
      app.quit()
      break
    default:
      break
  }
})

ipcMain.on(MainIpcChannel.MainMenu, () => {
  if (!mainWindow || !mainMenu) return
  mainMenu.popup({ window: mainWindow, x: 228, y: mainWindow.isMaximized() ? 34 : 38 })
})

// ipcMain.on(MainIpcChannel.ProjectMenu, () => {
//   if (!mainWindow || !projectMenu) return
//   const rectangle = mainWindow.getBounds()
//   projectMenu.popup({ window: mainWindow, x: rectangle.width - 38, y: mainWindow.isMaximized() ? 76 : 80 })
// })

ipcMain.on(MainIpcChannel.PagesMenu, () => {
  if (!mainWindow || !pagesMenu) return
  pagesMenu.popup({ window: mainWindow, x: 5, y: mainWindow.isMaximized() ? 76 : 80 })
  // pagesMenu.popup({ window: mainWindow, x: 130, y: mainWindow.isMaximized() ? 76 : 80 })
})

// https://jaketrent.com/post/select-directory-in-electron
ipcMain.on(MainIpcChannel.SelectDirs, async (event, arg) => {
  if (!mainWindow) return
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })
  event.returnValue = result.filePaths
})

ipcMain.on(MainIpcChannel.OpenPath, (event, folderPath: string, filePath: string) => {
  if (filePath) {
    const opath = path.resolve(folderPath, filePath)
    shell.openPath(opath)
  } else {
    shell.openPath(folderPath)
  }
})

ipcMain.on(MainIpcChannel.FocusElement, (event, payload: ElementPayload) => {
  const project = projects.get(payload.projectId)
  if (project) {
    project.activeSelector = payload.selector
  }
  mainWindow?.webContents.send(MainIpcChannel.FocusElement, payload)
})

ipcMain.on(MainIpcChannel.RespElementStatus, (event, payload: ElementActualStatus) => {
  mainWindow?.webContents.send(MainIpcChannel.RespElementStatus, payload)
})

ipcMain.on(MainIpcChannel.BlurElement, (event, projectId: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.activeSelector = undefined
    mainWindow?.webContents.send(MainIpcChannel.BlurElement, projectId)
  }
})

ipcMain.on(
  MainIpcChannel.LiveUpdateClass,
  (event, projectId: string, selector: string, className: string, needRespStatus: boolean) => {
    const project = projects.get(projectId)
    if (project) {
      project.view.webContents.send(MainIpcChannel.LiveUpdateClass, selector, className, needRespStatus)
    }
  },
)

ipcMain.on(MainIpcChannel.LiveUpdateText, (event, projectId: string, selector: string, text: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.send(MainIpcChannel.LiveUpdateText, selector, text)
  }
})

ipcMain.on(MainIpcChannel.LiveUpdateTag, (event, projectId: string, selector: string, tag: ElementTag) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.send(MainIpcChannel.LiveUpdateTag, selector, tag)
  }
})

ipcMain.on(MainIpcChannel.SelectBreadcrumb, (event, payload: BreadcrumbPayload) => {
  const project = projects.get(payload.projectId)
  if (project) {
    project.view.webContents.send(MainIpcChannel.SelectBreadcrumb, payload)
  }
})

ipcMain.on(MainIpcChannel.Refresh, (event, projectId: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.reloadIgnoringCache()
  }
})

ipcMain.on(MainIpcChannel.Forward, (event, projectId: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.goForward()
  }
})

ipcMain.on(MainIpcChannel.Backward, (event, projectId: string) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.goBack()
  }
})

ipcMain.on(MainIpcChannel.DisableLink, (event, projectId: string, isDisable: boolean) => {
  const project = projects.get(projectId)
  if (project) {
    project.view.webContents.send(MainIpcChannel.DisableLink, isDisable)
  }
})

ipcMain.on(MainIpcChannel.ElectronLog, (event, message: string) => {
  log.debug(message)
})

// ipcMain.on(MainIpcChannel.Dropped, (event, payload: ElementPayload) => {
//   if (!mainWindow) return
//   mainWindow.webContents.send(MainIpcChannel.Dropped, payload)
// })

// ipcMain.on(MainIpcChannel.TextTab, (event, payload: boolean) => {
//   if (!mainWindow) return
//   mainWindow.webContents.send(MainIpcChannel.TextTab, payload)
// })

app
  .whenReady()
  .then(async () => {
    console.log(`${app.getName()};isStudio:${isStudio};userData:${app.getPath('userData')}`)
    socketId = await findOpenSocket()
    createBackendProcess()
    createWindow()
    checkForUpdates(true)
    return null
  })
  .catch(Sentry.captureException)
