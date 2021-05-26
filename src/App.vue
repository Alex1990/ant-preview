<template>
  <ViewArea :src="url" />
  <StatusBar />
  <Toolbar />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useTitle } from '@vueuse/core'
import ViewArea from './components/ViewArea.vue'
import StatusBar from './components/StatusBar.vue'
import Toolbar from './components/Toolbar.vue'
import { VFile } from './store'

export default defineComponent({
  components: {
    ViewArea,
    StatusBar,
    Toolbar,
  },
  setup() {
    const store = useStore()
    const title = useTitle('Ant Preview')
    const url = ref('')
    window.electron.ipcRenderer.on('open', (file: VFile) => {
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
