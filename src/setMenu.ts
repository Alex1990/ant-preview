import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron'
import openFileDialog from './utils/openFileDialog'
import { getLocaleData, Locale } from './locales'

let menu: Menu
let fileOperationMenuItemEnabled = false

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
        {
          role: 'recentdocuments',
          label: localeData.menu.file.recentFiles.name,
          submenu: [
            {
              role: 'clearrecentdocuments',
              label: localeData.menu.file.recentFiles.clearFiles,
            }
          ]
        },
        { type: 'separator' },
        {
          id: 'print',
          label: localeData.menu.file.print,
          accelerator: isMac ? 'Cmd+P' : 'Ctrl+P',
          enabled: fileOperationMenuItemEnabled,
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
          id: 'propertyInfo',
          label: localeData.menu.view.propertyInfo,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+i' : 'Ctrl+i',
        },
        { type: 'separator' },
        {
          id: 'resetZoom',
          label: localeData.menu.view.resetZoom,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+0' : 'Ctrl+0',
        },
        {
          id: 'zoomOut',
          label: localeData.menu.view.zoomOut,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+-' : 'Ctrl+-',
        },
        {
          id: 'zoomIn',
          label: localeData.menu.view.zoomIn,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+Plus' : 'Ctrl+Plus',
        },
        { type: 'separator' },
        {
          id: 'rotateLeft',
          label: localeData.menu.view.rotateLeft,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+L' : 'Ctrl+L',
        },
        {
          id: 'rotateRight',
          label: localeData.menu.view.rotateRight,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          accelerator: isMac ? 'Cmd+R' : 'Ctrl+R',
        },
        {
          id: 'flipVertical',
          label: localeData.menu.view.flipVertical,
          enabled: fileOperationMenuItemEnabled,
          click: menuItemClick,
          // 'Shift' means there is a reverse command, so comment the below temporarily
          // accelerator: isMac ? 'Cmd+Shift+V' : 'Ctrl+Shift+V'
        },
        {
          id: 'flipHorizontal',
          label: localeData.menu.view.flipHorizontal,
          enabled: fileOperationMenuItemEnabled,
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

  menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])
  Menu.setApplicationMenu(menu)
}

const fileOperationMenuItemIds = [
  'print',
  'propertyInfo',
  'resetZoom',
  'zoomOut',
  'zoomIn',
  'rotateLeft',
  'rotateRight',
  'flipVertical',
  'flipHorizontal',
]

export function enableFileOperationMenuItems(): void {
  if (!fileOperationMenuItemEnabled) {
    for (const menuItemId of fileOperationMenuItemIds) {
      const menuItem = menu.getMenuItemById(menuItemId)
      menuItem.enabled = true
    }
    fileOperationMenuItemEnabled = true
  }
}