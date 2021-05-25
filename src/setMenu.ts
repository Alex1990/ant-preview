import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from 'electron'


const isMac = process.platform === 'darwin'

const menuItemClick = (item: MenuItem, focusedWindow: BrowserWindow) => {
  focusedWindow.webContents.send('menuItem', item.id)
}

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      {
        id: 'resetZoom',
        label: 'Reset Zoom',
        click: menuItemClick,
        accelerator: isMac ? 'Cmd+0' : 'Ctrl+0'
      },
      {
        id: 'zoomOut',
        label: 'Zoom Out',
        click: menuItemClick,
        accelerator: isMac ? 'Cmd+-' : 'Ctrl+-'
      },
      {
        id: 'zoomIn',
        label: 'Zoom In',
        click: menuItemClick,
        accelerator: isMac ? 'Cmd+Plus' : 'Ctrl+Plus'
      },
      { type: 'separator' },
      {
        id: 'rotateLeft',
        label: 'Rotate Left',
        click: menuItemClick,
        accelerator: isMac ? 'Cmd+L' : 'Ctrl+L'
      },
      {
        id: 'rotateRight',
        label: 'Rotate Right',
        click: menuItemClick,
        accelerator: isMac ? 'Cmd+R' : 'Ctrl+R'
      },
      {
        id: 'flipVertical',
        label: 'Flip Vertical',
        click: menuItemClick,
        // "Shift" means there is a reverse command, so comment the below temporarily
        // accelerator: isMac ? 'Cmd+Shift+V' : 'Ctrl+Shift+V'
      },
      {
        id: 'flipHorizontal',
        label: 'Flip Horizontal',
        click: menuItemClick,
        // "Shift" means there is a reverse command, so comment the below temporarily
        // accelerator: isMac ? 'Cmd+Shift+H' : 'Ctrl+Shift+H'
      },
      { type: 'separator' },
      { role: 'toggleDevtools' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More'
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])
Menu.setApplicationMenu(menu)