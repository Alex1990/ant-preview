<template>
    <div class="background">
        <img :src="url" class="image" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface VFile {
    path: string
    mime: string
    data: Uint8Array
}

export default defineComponent({
    setup() {
        const url = ref('')
        window.electron.ipcRenderer.on('open', (file: VFile) => {
            const blob = new Blob([file.data.buffer], { type: file.mime })
            url.value = URL.createObjectURL(blob)
        })
        return {
            url
        }
    }
})
</script>

<style scoped>
.background {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
</style>
