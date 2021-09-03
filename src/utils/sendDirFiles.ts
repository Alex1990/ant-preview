import { BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import { DirFile } from '../types'
import isSupportExtension from './isSupportExtension'
import logger from './logger'

const fsp = fs.promises

let lastDir = ''

export default async function sendDirFiles(win: BrowserWindow, file: string): Promise<void> {
  const dir = path.dirname(file)
  if (dir !== lastDir) {
    lastDir = dir
    const files = await fsp.readdir(dir)

    logger.log('info', `read dir: ${dir}, file count: ${files.length}`)

    const filteredFiles = files.filter(file => {
      let extname = path.extname(file)
      if (extname) extname = extname.slice(1)
      return isSupportExtension(extname)
    })
    const readAllStats = filteredFiles.map(async file => {
      try {
        const {
          size,
          atime,
          mtime,
          ctime,
        } = await fsp.stat(path.join(dir, file))
        return {
          fileName: file,
          size,
          atime,
          mtime,
          ctime,
        }
      } catch (err) {
        return err
      }
    })
    const allStats = await Promise.all(readAllStats)
    const fileList: DirFile[] = [];
    for (const stats of allStats) {
      if (!(stats instanceof Error)) {
        const {
          fileName,
          size,
          atime,
          mtime,
          ctime,
        } = stats
        fileList.push({
          path: path.join(dir, fileName),
          fileName,
          extName: path.extname(file).slice(1),
          size,
          atime,
          mtime,
          ctime,
        })
      }
    }

    win.webContents.send('dir-files', fileList)

    logger.log('info', `send dir file count: ${fileList.length}`)
  }
}
