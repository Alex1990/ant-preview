import fs from 'fs'
import path from 'path'
import { app, BrowserWindow } from 'electron';
import readChunk from 'read-chunk'
import FileType from 'file-type'
import isSvg from 'is-svg'
import './setMenu.ts'

const fsp = fs.promises

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let file = '/Users/chaoalex/Documents/picky.png'

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, '../renderer/main_window/preload.js')
    },
  });

  // and load the index.html of the app.
  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const buffer = readChunk.sync(file, 0, 4100)
  const fileType = await FileType.fromBuffer(buffer)
  let mime = ''
  const data = await fsp.readFile(file)
  if (fileType) {
    mime = fileType.mime
  } else if (isSvg(data)) {
    mime = 'image/svg+xml'
  }
  mainWindow.webContents.send('open', {
    path: file,
    mime,
    data,
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.on('open-file', (e: Event, path: string) => {
  e.preventDefault()
  file = path
})