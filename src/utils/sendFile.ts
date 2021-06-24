import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import readChunk from 'read-chunk'
import FileType from 'file-type'
import isSvg from 'is-svg'
import exifr from 'exifr'
import extensions from './extensions'

const fsp = fs.promises

function showNotSupportMessage() {
  dialog.showErrorBox('Unsupported format', 'This extension of the file is not supported.')
}

export default async function sendFile(win: BrowserWindow, file: string): Promise<void> {
  const buffer = readChunk.sync(file, 0, 4100)
  const fileType = await FileType.fromBuffer(buffer)
  let mime = ''
  let ext = ''
  if (fileType) {
    mime = fileType.mime
    ext = fileType.ext
    if (!extensions.includes(ext)) {
      showNotSupportMessage()
      return
    }
  }
  const data = await fsp.readFile(file)

  if (!fileType) {
    if (isSvg(data)) {
      mime = 'image/svg+xml'
      ext = 'svg'
    } else {
      showNotSupportMessage()
      return
    }
  }

  const stats = await fsp.stat(file)
  const meta = await exifr.parse(file)

  win.webContents.send('open', {
    path: file,
    name: path.basename(file),
    mime,
    data,
    stats,
    meta,
  })
}