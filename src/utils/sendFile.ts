import { BrowserWindow } from 'electron'
import fs from 'fs'
import readChunk from 'read-chunk'
import FileType from 'file-type'
import isSvg from 'is-svg'

const fsp = fs.promises

export default async function sendFile(win: BrowserWindow, file: string): Promise<void> {
  const buffer = readChunk.sync(file, 0, 4100)
  const fileType = await FileType.fromBuffer(buffer)
  let mime = ''
  const data = await fsp.readFile(file)
  if (fileType) {
    mime = fileType.mime
  } else if (isSvg(data)) {
    mime = 'image/svg+xml'
  }
  win.webContents.send('open', {
    path: file,
    mime,
    data,
  })
}