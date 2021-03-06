import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import logger from './utils/logger'
import { get, set } from './utils/settings'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: function (eventName: string, callback: (data: string) => void) {
      ipcRenderer.on(eventName, (event: IpcRendererEvent, data: string) => {
        callback(data)
      })
    },
    send: function(eventName: string, data: string): void {
      ipcRenderer.send(eventName, data)
    },
    settings: {
      get,
      set,
    },
    logger: function (level: string, message: string) {
      logger.log(level, message)
    },
  },
})
