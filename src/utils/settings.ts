import fs from 'fs'
import path from 'path'
import { Settings } from '../types/Settings'

const fsp = fs.promises

const appRoot = process.cwd()
const settingsFile = path.join(appRoot, 'settings.json')

const defaultSettings: Settings = {
  canvasBackgroundColor: '#f8f8f8'
}

let settings = ''

try {
  const content = fs.readFileSync(settingsFile, 'utf8')
  if (content) {
    settings = content
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
    settings = await fsp.readFile(settingsFile, 'utf8')
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
