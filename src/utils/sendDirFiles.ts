import { BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import isSupportExtension from './isSupportExtension'

const fsp = fs.promises

let lastDir = ''

export default async function sendDirFiles(win: BrowserWindow, file: string): Promise<void> {
  const dir = path.dirname(file)
  if (dir !== lastDir) {
    lastDir = dir
    const files = await fsp.readdir(dir)
    const fileList: string[] = files.filter(file => {
      let extname = path.extname(file)
      if (extname) extname = extname.slice(1)
      return isSupportExtension(extname)
    })
    win.webContents.send('dir-files', fileList)
  }
}
