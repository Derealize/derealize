/* eslint global-require: off, no-console: off */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { fork, ChildProcess } from 'child_process'
import path from 'path'
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import findOpenSocket from './utils/find-open-socket'
import MenuBuilder from './menu'
import store from './store'

const isDev = process.env.NODE_ENV === 'development'

process.on('uncaughtException', (err) => {
  log.error('uncaughtException', err)
  const messageBoxOptions = {
    type: 'error',
    title: 'Error in Main process',
    message: 'Something failed',
  }
  dialog.showMessageBox(messageBoxOptions)
})

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null

if (!isDev) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (isDev || process.env.DEBUG_PROD === 'true') {
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
    .catch(console.log)
}

const createWindow = async (socketId: string) => {
  if (isDev || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, isDev ? 'preload.js' : 'preload.prod.js'),
    },
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }

    mainWindow.webContents.send('set-socket', { socketId })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    const scoketId = await findOpenSocket()
    createWindow(scoketId)
  }
})

const createBackendWindow = (socketId: string) => {
  // gitnode 还未支持non-context-aware, 希望未来支持
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
    },
  })
  backendWin.loadURL(`file://${__dirname}/backend/backend.dev.html`)
  backendWin.webContents.openDevTools()

  backendWin.webContents.on('did-finish-load', () => {
    backendWin.webContents.send('set-socket', { socketId })
  })
}

let backendProcess: ChildProcess
const createBackendProcess = (socketId: string) => {
  if (process.env.DEV_PROCESS === 'true') {
    backendProcess = fork(`${__dirname}/backend/backend.ts`, ['--subprocess', app.getVersion(), socketId], {
      execArgv: ['-r', './.erb/scripts/BabelRegister'],
    })
  } else {
    backendProcess = fork(`${__dirname}/backend.prod.js`, ['--subprocess', app.getVersion(), socketId])
  }

  backendProcess.on('message', (msg) => {
    log.info(`backendProcess: ${msg}`)
  })
}

app
  .whenReady()
  .then(async () => {
    console.log('app ready!')

    const socketId = await findOpenSocket()
    createWindow(socketId)

    if (!isDev || process.env.DEV_PROCESS === 'true') {
      createBackendProcess(socketId)
    } else {
      createBackendWindow(socketId)
    }

    return null
  })
  .catch(console.log)

ipcMain.on('getStore', (event, key: string) => {
  const value = store.get(key)
  event.returnValue = value
})

ipcMain.on('setStore', (event, payload: Record<string, unknown>) => {
  store.set(payload)
  // event.sender.send('setStore-reply', true)
})
