<template>
  <div
    v-if="hasFile"
    class="toolbar"
    :style="{transform: `translate(${offsetX}px,${offsetY}px)`}"
    v-drag="onDrag"
    ref="toolbar"
  >
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
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Store, useStore } from 'vuex'
import { useStorage } from '@vueuse/core'
import { Handler, useDrag } from '@vueuse/gesture'
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
    case 'settings':
      store.commit('toggleSettingsVisible')
      break
    default:
      break
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

    const toolbar = ref(null)
    let lastOffsetX = useStorage('toolbarLastOffsetX', 0, localStorage)
    let lastOffsetY = useStorage('toolbarLastOffsetY', 0, localStorage)
    const offsetX = ref(lastOffsetX.value)
    const offsetY = ref(lastOffsetY.value)

    const onDrag: Handler<'drag', PointerEvent> = ({ movement: [x, y], dragging }) => {
      offsetX.value = lastOffsetX.value + x
      offsetY.value = lastOffsetY.value + y
      if (!dragging) {
        lastOffsetX.value += x
        lastOffsetY.value += y
      }
    }
    onMounted(() => {
      useDrag(onDrag, {
        domTarget: toolbar,
      })
    })

    return {
      hasFile: computed(() => store.getters.hasFile),
      tools,
      toolbar,
      offsetX,
      offsetY,
      onToolClick,
      onDrag,
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
