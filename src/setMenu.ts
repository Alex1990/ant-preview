import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron'
import openFileDialog from './utils/openFileDialog'
import { getLocaleData, Locale } from './locales'

export function setMenu(): void {
  const isMac = process.platform === 'darwin'
  const locale = app.getLocale() as Locale
  const localeData = getLocaleData(locale)

  const menuItemClick = (item: MenuItem, focusedWindow: BrowserWindow) => {
    focusedWindow.webContents.send('menuItem', item.id)
  }

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
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
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: localeData.menu.file.name,
      submenu: [
        {
          id: 'openFile',
          label: localeData.menu.file.openFile,
          accelerator: isMac ? 'Cmd+O' : 'Ctrl+O',
          click(item: MenuItem, focusedWindow: BrowserWindow) {
            openFileDialog(focusedWindow)
          },
        },
        { type: 'separator' },
        {
          id: 'print',
          label: localeData.menu.file.print,
          accelerator: isMac ? 'Cmd+P' : 'Ctrl+P',
          click: menuItemClick,
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    // { role: 'viewMenu' }
    {
      label: localeData.menu.view.name,
      submenu: [
        {
          id: 'resetZoom',
          label: localeData.menu.view.resetZoom,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+0' : 'Ctrl+0',
        },
        {
          id: 'zoomOut',
          label: localeData.menu.view.zoomOut,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+-' : 'Ctrl+-',
        },
        {
          id: 'zoomIn',
          label: localeData.menu.view.zoomIn,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+Plus' : 'Ctrl+Plus',
        },
        { type: 'separator' },
        {
          id: 'rotateLeft',
          label: localeData.menu.view.rotateLeft,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+L' : 'Ctrl+L',
        },
        {
          id: 'rotateRight',
          label: localeData.menu.view.rotateRight,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+R' : 'Ctrl+R',
        },
        {
          id: 'flipVertical',
          label: localeData.menu.view.flipVertical,
          click: menuItemClick,
          // 'Shift' means there is a reverse command, so comment the below temporarily
          // accelerator: isMac ? 'Cmd+Shift+V' : 'Ctrl+Shift+V'
        },
        {
          id: 'flipHorizontal',
          label: localeData.menu.view.flipHorizontal,
          click: menuItemClick,
          // 'Shift' means there is a reverse command, so comment the below temporarily
          // accelerator: isMac ? 'Cmd+Shift+H' : 'Ctrl+Shift+H'
        },
        { type: 'separator' },
        { role: 'toggleDevtools' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: localeData.menu.window.name,
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: localeData.menu.help.learn,
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])
  Menu.setApplicationMenu(menu)
}
