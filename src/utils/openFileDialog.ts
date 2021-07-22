import { BrowserWindow, dialog } from 'electron'
import sendFile from './sendFile'
import extensions from './extensions'
import sendDirFiles from './sendDirFiles'

export default async function openFileDialog(win: BrowserWindow): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions },
    ],
  })
  if (!canceled && filePaths.length > 0) {
    sendFile(win, filePaths[0])
    sendDirFiles(win, filePaths[0])
  }
}