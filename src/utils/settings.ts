import os from 'os'
import fs from 'fs'
import path from 'path'
import pkg from '../../package.json'
import { Settings } from '../types/Settings'

const fsp = fs.promises

const settingsDir = path.join(os.homedir(), `.${pkg.name}`)
const settingsFile = path.join(settingsDir, 'settings.json')

const defaultSettings: Settings = {
  canvasBackgroundColor: '#f8f8f8'
}

let settings = ''

try {
  fs.accessSync(settingsDir)
} catch (err) {
  fs.mkdirSync(settingsDir)
}

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
