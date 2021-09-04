import os from 'os'
import fs from 'fs'
import path from 'path'
import pkg from '../../package.json'
import { Settings } from '../types/Settings'

const fsp = fs.promises

export const settingsDir = path.join(os.homedir(), `.${pkg.name}`)

export const settingsFile = path.join(settingsDir, 'settings.json')

const defaultSettings: Settings = {
  locale: 'en-US',
  canvasBackgroundColor: '#f8f8f8',
  sortBy: 'fileName',
  sortType: 'asc',
}

export let settings = ''

try {
  fs.accessSync(settingsDir)
} catch (err) {
  fs.mkdirSync(settingsDir)
}

try {
  const content = fs.readFileSync(settingsFile, 'utf8')
  if (content) {
    const obj = JSON.parse(content)
    const settingsObj = {
      ...defaultSettings,
      ...obj,
    }
    settings = JSON.stringify(settingsObj)
  } else {
    settings = JSON.stringify(defaultSettings)
    fs.writeFileSync(settingsFile, settings)
  }
} catch (err) {
  settings = JSON.stringify(defaultSettings)
  fs.writeFileSync(settingsFile, settings)
}

export async function get(): Promise<string> {
  try {
    const content = await fsp.readFile(settingsFile, 'utf8')
    if (content) {
      const obj = JSON.parse(content)
      const settingsObj = {
        ...defaultSettings,
        ...obj,
      }
      settings = JSON.stringify(settingsObj)
    }
  } catch (err) {
    settings = JSON.stringify(defaultSettings)
    await fsp.writeFile(settingsFile, settings, 'utf8')
  }
  return settings
}

export async function set(newVal: string): Promise<void> {
  settings = newVal
  await fsp.writeFile(settingsFile, settings, 'utf8')
}

export async function getSettings(): Promise<Settings> {
  const settingsStr = await get()
  return JSON.parse(settingsStr)
}
