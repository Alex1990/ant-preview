<template>
    <div class="status-bar">
        {{ `${scale * 100}%`}}
        {{ `  |  `}}
        {{ `${width} x ${height} pixels`}}
        {{ `  |  `}}
        {{ `${mime}`}}
        {{ `  |  `}}
        {{ `${size}`}}
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import prettyBytes from 'pretty-bytes'

export default defineComponent({
    setup() {
        const store = useStore()
        return {
            mime: computed(() => {
                const { file } = store.state
                return file ? file.mime : ''
            }),
            size: computed(() => {
                const { file } = store.state
                return file ? prettyBytes(file.stats.size) : ''
            }),
            scale: computed(() => Math.abs(store.state.scale[0])),
            width: computed(() => store.state.width),
            height: computed(() => store.state.height),
        }
    },
})
</script>

<style scoped>
.status-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 24px;
    padding: 0 8px;
    font-size: 14px;
    line-height: 24px;
    white-space: pre;
    border-top: 1px solid #aaa;
    background: #ddd;
    color: #333;
}
</style>
