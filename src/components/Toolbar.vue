<template>
  <div v-if="hasFile" class="toolbar">
    <div class="toolbar-content">
      <Tool
        v-for="tool in tools"
        :key="tool.icon"
        :name="tool.name"
        :icon="tool.icon"
        :title="tool.title"
        @click="onToolClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Store, useStore } from 'vuex'
import Tool from './Tool.vue'
import useTools from '../uses/useTools'
import { State } from '../store'

const handleCommand = (store: Store<State>, name: string) => {
  switch (name) {
    case 'rotateLeft':
      store.commit('rotateLeft')
      break
    case 'rotateRight':
      store.commit('rotateRight')
      break
    case 'flipVertical':
      store.commit('flipVertical')
      break
    case 'flipHorizontal':
      store.commit('flipHorizontal')
      break
    case 'resetZoom':
      store.commit('resetZoom')
      break
    case 'zoomOut':
      store.commit('zoomOut')
      break
    case 'zoomIn':
      store.commit('zoomIn')
      break
    case 'print':
      // TODO: need restore zoom after printing
      store.commit('resetZoom')
      // Wait for dom updating
      setTimeout(() => {
        window.print()
      }, 0)
      break
    case 'propertyInfo':
      store.commit('togglePropertyInfo')
      break
    default:
      console.error('unknown command')
  }
}

export default defineComponent({
  components: {
    Tool,
  },
  setup() {
    const tools = useTools()
    const store = useStore()
    const onToolClick = (name: string) => {
      handleCommand(store, name)
    }
    window.electron.ipcRenderer.on('menuItem', (id: string) => {
      handleCommand(store, id)
    })
    return {
      hasFile: computed(() => store.getters.hasFile),
      tools,
      onToolClick,
    }
  },
})
</script>

<style scoped>
.toolbar {
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-content {
  display: flex;
  padding: 0 16px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
}

@media print {
  .toolbar {
    visibility: hidden;
  }
}
</style>
