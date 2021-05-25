<template>
    <ViewArea :src="url" />
    <Toolbar />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ViewArea from './components/ViewArea.vue'
import Toolbar from './components/Toolbar.vue'

interface VFile {
    path: string
    mime: string
    data: Uint8Array
}

export default defineComponent({
    components: {
        ViewArea,
        Toolbar
    },
    setup() {
        const url = ref('')
        window.electron.ipcRenderer.on('open', (file: VFile) => {
            const blob = new Blob([file.data.buffer], { type: file.mime })
            if (url.value) {
                URL.revokeObjectURL(url.value)
            }
            url.value = URL.createObjectURL(blob)
        })
        return {
            url
        }
    }
})
</script>
