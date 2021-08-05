import { ref, watch, Ref } from 'vue'
import { Settings } from '../types/Settings'

export default function useSettings(): Ref<Settings> {
  const settings = ref({})

  window.electron.ipcRenderer.settings.get()
    .then((initialSettings: string) => {
      settings.value = JSON.parse(initialSettings) as Settings
    })
  
  watch(settings, (val) => {
    window.electron.ipcRenderer.settings.set(JSON.stringify(val))
  }, { deep: true })

  return settings
}
