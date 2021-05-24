import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        on: function (eventName: string, callback: (data: string) => void) { 
            ipcRenderer.on(eventName, (event: IpcRendererEvent, data: string) => {
                callback(data)
            })
        }
    }
})
