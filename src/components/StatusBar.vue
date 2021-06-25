<template>
  <div class="status-bar">
    {{ `${scale}%` }}
    {{ `  |  ` }}
    {{ `${naturalWidth} x ${naturalHeight} pixels` }}
    {{ `  |  ` }}
    {{ `${mime}` }}
    {{ `  |  ` }}
    {{ `${size}` }}
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
      scale: computed(() => {
        const result = Math.abs(store.state.scale[0]) * 100
        if (Number.isInteger(result)) {
          return String(result)
        } else {
          if (Number.isInteger(result * 10)) {
            return result.toFixed(1)
          }
          return result.toFixed(2)
        }
      }),
      naturalWidth: computed(() => store.state.naturalWidth),
      naturalHeight: computed(() => store.state.naturalHeight),
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

@media print {
  .status-bar {
    visibility: hidden;
  }
}

@media screen and (prefers-color-scheme: dark) {
  .status-bar {
    border-top-color: #666;
    background: #333;
    color: #ddd;
  }
}
</style>
