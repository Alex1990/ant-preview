import { BrowserWindow, dialog } from 'electron'
import sendFile from './sendFile'

export default async function openFileDialog(win: BrowserWindow): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile']
  })
  if (!canceled && filePaths.length > 0) {
    sendFile(win, filePaths[0])
  }
}