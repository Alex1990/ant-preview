import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import readChunk from 'read-chunk'
import FileType from 'file-type'
import isSvg from 'is-svg'
import exifr from 'exifr'
import extensions from './extensions'
import { enableFileOperationMenuItems } from '../setMenu'
import logger from './logger'

const fsp = fs.promises

export default async function sendFile(win: BrowserWindow, file: string): Promise<void> {
  const buffer = readChunk.sync(file, 0, 4100)
  const fileType = await FileType.fromBuffer(buffer)
  let mime = ''
  let ext = ''
  if (fileType) {
    mime = fileType.mime
    ext = fileType.ext
    if (!extensions.includes(ext)) {
      // TODO: need ipc message data format
      win.webContents.send('open-error', file)
      logger.log('info', `file open error: ${file}`)
      return
    }
  }
  const data = await fsp.readFile(file)

  if (!fileType) {
    if (isSvg(data)) {
      mime = 'image/svg+xml'
      ext = 'svg'
    } else {
      win.webContents.send('open-error', file)
      logger.log('info', `file open error: ${file}`)
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

  logger.log('info', `send file: ${file}, mime: ${mime}`)

  enableFileOperationMenuItems()
  app.addRecentDocument(file)
}