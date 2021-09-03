import path from 'path'
import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { setMenu } from './setMenu'
import sendFile from './utils/sendFile'
import openFileDialog from './utils/openFileDialog'
import sendDirFiles from './utils/sendDirFiles'
import logger from './utils/logger'

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string

const devtoolsEnabled = process.env.NODE_ENV === 'development'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

logger.log('info', 'app start')

let file = ''

if (process.platform === 'win32') {
  file = process.argv[1] || ''
}

let mainWindow: BrowserWindow

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.resolve(__dirname, 'assets/images/logo_256x256.png'),
    webPreferences: {
      devTools: devtoolsEnabled,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, '../renderer/main_window/preload.js')
    },
  });

  // and load the index.html of the app.
  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  logger.log('info', 'index html loaded')

  if (file) {
    sendFile(mainWindow, file)
  } else {
    openFileDialog(mainWindow)
  }

  ipcMain.on('drop-file', (e: IpcMainEvent, file: string) => {
    logger.log('info', `drop-file: ${file}`)
    sendFile(mainWindow, file)
    sendDirFiles(mainWindow, file)
  })

  ipcMain.on('nav-file', (e: IpcMainEvent, file: string) => {
    logger.log('info', `nav-file: ${file}`)
    sendFile(mainWindow, file)
    sendDirFiles(mainWindow, file)
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  logger.log('info', 'app ready')
  setMenu({ devtoolsEnabled })
  createWindow()
  if (devtoolsEnabled) {
    try {
      const name = await installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
        forceDownload: false,
      })
      console.log('devtools extension installed:', name)
    } catch (err) {
      console.log('devtools extension install failed:', err)
    }
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

app.on('open-file', (e: Event, filePath: string) => {
  logger.log('info', `open-file event: ${filePath}`)
  e.preventDefault()
  // On Windows, you have to parse process.argv (in the main process) to get the filepath.
  // https://www.electronjs.org/docs/api/app#event-open-file-macos
  file = filePath
  if (mainWindow) {
    sendFile(mainWindow, file)
    sendDirFiles(mainWindow, file)
  }
})