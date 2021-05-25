<template>
  <ViewArea :src="url" />
  <Toolbar />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import ViewArea from './components/ViewArea.vue'
import Toolbar from './components/Toolbar.vue'

interface VFile {
  path: string
  name: string
  mime: string
  data: Uint8Array
}

export default defineComponent({
  components: {
    ViewArea,
    Toolbar,
  },
  setup() {
    const url = ref('')
    const title = useTitle('Ant Preview')
    window.electron.ipcRenderer.on('open', (file: VFile) => {
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
