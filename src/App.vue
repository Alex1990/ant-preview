<template>
  <OpenFailed
    v-if="openFailedFile"
    :failed-file="openFailedFile"
  />
  <template v-else>
    <ViewArea :src="url" />
    <StatusBar />
    <Toolbar />
    <PropertyInfo />
  </template>
  <ArrowNav v-if="openFailedFile || url" />
  <Settings v-if="settingsVisible" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useTitle } from '@vueuse/core'
import OpenFailed from './components/OpenFailed.vue'
import ViewArea from './components/ViewArea.vue'
import StatusBar from './components/StatusBar.vue'
import Toolbar from './components/Toolbar.vue'
import PropertyInfo from './components/PropertyInfo.vue'
import Settings from './components/Settings.vue'
import ArrowNav from './components/ArrowNav.vue'
import useSettings from './uses/useSettings'
import { VFile } from './store'

export default defineComponent({
  components: {
    OpenFailed,
    ViewArea,
    StatusBar,
    Toolbar,
    PropertyInfo,
    Settings,
    ArrowNav,
  },
  setup() {
    const store = useStore()
    const title = useTitle('Ant Preview')
    const url = ref('')

    window.electron.ipcRenderer.on('open', (file: VFile) => {
      store.commit('reset')
      store.commit('setFile', file)
      title.value = file.name
      const blob = new Blob([file.data.buffer], { type: file.mime })
      if (url.value) {
        URL.revokeObjectURL(url.value)
      }
      url.value = URL.createObjectURL(blob)
    })

    window.electron.ipcRenderer.on('open-error', (filePath: string) => {
      console.log(filePath)
      store.commit('setOpenFailedFile', filePath)
    })


    window.electron.ipcRenderer.on('dir-files', (files: string[]) => {
      store.commit('setDirFiles', files)
    })

    const settings = useSettings()

    onMounted(() => {
      document.body.style.background = settings.value.canvasBackgroundColor
    })

    watch(() => settings.value.canvasBackgroundColor, (color: string) => {
      document.body.style.background = color
    })

    return {
      url,
      settingsVisible: computed(() => store.state.settingsVisible),
      openFailedFile: computed(() => store.state.openFailedFile),
    }
  },
})
</script>
