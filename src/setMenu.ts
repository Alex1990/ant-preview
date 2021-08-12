import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron'
import openFileDialog from './utils/openFileDialog'
import { getSettings } from './utils/settings'
import { getLocaleData, Locale } from './locales'

let menu: Menu
let fileOperationMenuItemEnabled = false
let template: (MenuItem | MenuItemConstructorOptions)[] = []

interface Options {
  devtoolsEnabled: boolean
}

export async function setMenu({ devtoolsEnabled }: Options): Promise<void> {
  const isMac = process.platform === 'darwin'
  const locale = app.getLocale() as Locale
  const settings = await getSettings()
  const localeData = getLocaleData(settings.locale || locale)

  const menuItemClick = (item: MenuItem, focusedWindow: BrowserWindow) => {
    focusedWindow.webContents.send('menuItem', item.id)
  }

  let isFullScreen = false;
  const onFullScreen = (item: MenuItem, focusedWindow: BrowserWindow) => {
    isFullScreen = !isFullScreen
    focusedWindow.webContents.send('fullscreenchange', isFullScreen)
    focusedWindow.setFullScreen(isFullScreen)
    for (const subMenu of template) {
      if (subMenu.id === 'view') {
        for (const menuItem of subMenu.submenu as MenuItemConstructorOptions[]) {
          if (menuItem.id === 'fullscreen') {
            if (isFullScreen) {
              menuItem.label = localeData.menu.view.exitFullScreen
            } else {
              menuItem.label = localeData.menu.view.enterFullScreen
            }
          }
        }
      }
    }
    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    fileOperationMenuItemEnabled = false
    enableFileOperationMenuItems()
  }

  const devtoolsMenuItems: (MenuItem | MenuItemConstructorOptions)[] = []
  if (devtoolsEnabled) {
    devtoolsMenuItems.push({ type: 'separator' })
    devtoolsMenuItems.push({ role: 'toggleDevTools' })
  }

  template = [
    ...(isMac
      ? [
          {
            id: 'app',
            label: localeData.menu.app.name,
            submenu: [
              {
                role: 'about',
                label: localeData.menu.app.about,
              },
              { type: 'separator' },
              {
                role: 'services',
                label: localeData.menu.app.services,
              },
              { type: 'separator' },
              {
                role: 'hide',
                label: localeData.menu.app.hide,
              },
              {
                role: 'hideothers',
                label: localeData.menu.app.hideothers,
              },
              {
                role: 'unhide',
                label: localeData.menu.app.unhide,
              },
              { type: 'separator' },
              {
                role: 'quit',
                label: localeData.menu.app.quit,
              },
            ],
          },
        ]
      : [] as MenuItemConstructorOptions[]),
    {
      id: 'file',
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
          role: 'recentDocuments',
          label: localeData.menu.file.recentFiles.name,
          submenu: [
            {
              role: 'clearRecentDocuments',
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
        {
          id: 'settings',
          label: localeData.menu.file.settings,
          click: menuItemClick,
        },
        { type: 'separator' },
        isMac ? {
          role: 'close',
          label: localeData.menu.file.close,
        } : {
          role: 'quit',
          label: localeData.menu.file.quit,
        },
      ],
    },
    {
      id: 'navigation',
      label: localeData.menu.navigation.name,
      submenu: [
        {
          id: 'prev',
          label: localeData.menu.navigation.prev,
          accelerator: 'Left',
          click: menuItemClick,
        },
        {
          id: 'next',
          label: localeData.menu.navigation.next,
          accelerator: 'Right',
          click: menuItemClick,
        },
      ],
    },
    {
      id: 'view',
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
        {
          id: 'fullscreen',
          label: localeData.menu.view.enterFullScreen,
          enabled: fileOperationMenuItemEnabled,
          click: onFullScreen,
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
        ...devtoolsMenuItems,
      ],
    },
    {
      id: 'window',
      label: localeData.menu.window.name,
      submenu: [
        {
          role: 'minimize',
          label: localeData.menu.window.minimize,
        },
        {
          role: 'zoom',
          label: localeData.menu.window.zoom,
        },
        ...(isMac
          ? [
              { type: 'separator' },
              {
                role: 'front',
                label: localeData.menu.window.front,
              },
              { type: 'separator' },
            ] as MenuItemConstructorOptions[]
          : [
            {
              role: 'close',
              label: localeData.menu.window.close,
            }
          ] as MenuItemConstructorOptions[]),
      ],
    },
    {
      id: 'help',
      label: localeData.menu.help.name,
      submenu: [
        {
          label: localeData.menu.help.learn,
        },
      ],
    },
  ] as MenuItemConstructorOptions[]

  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const fileOperationMenuItemIds = [
  'print',
  'propertyInfo',
  'resetZoom',
  'zoomOut',
  'zoomIn',
  'fullscreen',
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