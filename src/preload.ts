import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: function (eventName: string, callback: (data: string) => void) {
      ipcRenderer.on(eventName, (event: IpcRendererEvent, data: string) => {
        callback(data)
      })
    },
    send: function(eventName: string, data: string): void {
      ipcRenderer.send(eventName, data)
    }
  },
})
