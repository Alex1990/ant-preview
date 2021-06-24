<template>
  <ViewArea :src="url" />
  <StatusBar />
  <Toolbar />
  <PropertyInfo />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useTitle } from '@vueuse/core'
import ViewArea from './components/ViewArea.vue'
import StatusBar from './components/StatusBar.vue'
import Toolbar from './components/Toolbar.vue'
import PropertyInfo from './components/PropertyInfo.vue'
import { VFile } from './store'

export default defineComponent({
  components: {
    ViewArea,
    StatusBar,
    Toolbar,
    PropertyInfo,
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

    return {
      url,
    }
  },
})
</script>
