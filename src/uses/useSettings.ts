import { Ref } from 'vue'
import { useStorage } from '@vueuse/core'

export interface AppSettings {
  canvasBackgroundColor: string
}

const defaultSettings = {
  canvasBackgroundColor: '#f8f8f8'
}

export default function useSettings(): Ref<AppSettings> {
  const settings = useStorage('settings', defaultSettings, localStorage)
  return settings
}
