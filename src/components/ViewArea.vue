<template>
  <div v-if="src" class="background" ref="background">
    <img
      v-if="src"
      :src="src"
      class="image"
      :class="cls"
      :style="style"
      ref="image"
      @load="onLoad"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseout="onMouseOut"
    />
  </div>
  <div v-else class="background" ref="background" @drop="onDrop" @dragover="onDragOver">
    <p class="empty-tip">
      {{ localeData.tips.empty }}
    </p>
  </div>
</template>

<script lang="ts">
import { watch, computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import micell from 'micell'
import useSettings from '../uses/useSettings'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'

export default defineComponent({
  props: {
    src: String,
  },
  setup(props) {
    const settings = useSettings()
    const localeData = computed(() => getBrowserLocaleData(settings.value.locale))
    const background = ref(null)
    const image = ref(null)
    const store = useStore()
    const cls = ref('')

    watch(() => props.src, () => {
      cls.value = ''
    })

    const style = computed(() => {
      const { naturalWidth, naturalHeight, scale, rotate } = store.state
      const [x, y] = scale
      const ratio = Math.abs(x)
      return {
        transform: `scale(${Math.sign(x)},${Math.sign(y)}) rotate(${rotate}deg)`,
        width: `${ratio * naturalWidth}px`,
        height: `${ratio * naturalHeight}px`,
      }
    })

    const onLoad = () => {
      cls.value = 'show'
      const { width, height } = micell.dom.viewport(background.value)
      const { naturalWidth, naturalHeight } = image.value
      const hRatio = width / naturalWidth
      const vRatio = height / naturalHeight
      const ratio = hRatio < vRatio ? hRatio : vRatio
      store.commit('setScale', [ratio, ratio])
      store.commit('setDimensions', { width, height, naturalWidth, naturalHeight })
    }

    const onResize = () => {
      if (!props.src) return
      const { width, height } = micell.dom.viewport(background.value)
      const { naturalWidth, naturalHeight } = image.value
      const hRatio = width / naturalWidth
      const vRatio = height / naturalHeight
      const ratio = hRatio < vRatio ? hRatio : vRatio
      store.commit('setScale', [ratio, ratio])
      store.commit('setDimensions', { width, height, naturalWidth, naturalHeight })
    }

    const onWheel = (e: WheelEvent) => {
      if (props.src && e.ctrlKey) {
        if (e.deltaY > 0) {
          store.commit('zoomOut')
        } else {
          store.commit('zoomIn')
        }
      }
    }
    onMounted(() => {
      window.addEventListener('resize', onResize)
      document.addEventListener('mousewheel', onWheel)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousewheel', onWheel)
    })

    let dragging = false
    let scrollWidth = 0
    let scrollHeight = 0
    let clientWidth = 0
    let clientHeight = 0
    let left = 0
    let top = 0
    let x = 0
    let y = 0
    const onMouseDown = (e: MouseEvent) => {
      if (e.ctrlKey) {
        dragging = true
        scrollWidth = background.value.scrollWidth
        scrollHeight = background.value.scrollHeight
        clientWidth = background.value.clientWidth
        clientHeight = background.value.clientHeight
        left = background.value.scrollLeft
        top = background.value.scrollTop
        x = e.screenX
        y = e.screenY
      }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (e.ctrlKey) {
        if (dragging) {
          const scrollLeft = left - (e.screenX - x)
          const scrollTop = top - (e.screenY - y)
          if (scrollLeft > 0 && scrollLeft < scrollWidth - clientWidth) {
            background.value.scrollLeft = scrollLeft
          }
          if (scrollTop > 0 && scrollTop < scrollHeight - clientHeight) {
            background.value.scrollTop = scrollTop
          }
        }
      } else {
        dragging = false
      }
    }
    const onMouseUp = (e: MouseEvent) => {
      if (dragging) {
        dragging = false
      }
    }
    const onMouseOut = () => {
      if (dragging) {
        dragging = false
      }
    }

    return {
      localeData,
      background,
      image,
      cls,
      scale: computed(() => store.state.scale),
      style,
      onLoad,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseOut,
    }
  },
  watch: {
    scale(scale, oldScale) {
      const { naturalWidth, naturalHeight } = this.$store.state
      const { fitRatio } = this.$store.getters
      const ratio = Math.abs(scale[0])

      if (ratio <= fitRatio) return

      const oldRatio = Math.abs(oldScale[0])
      const width = ratio * naturalWidth
      const height = ratio * naturalHeight
      const oldWidth = oldRatio * naturalWidth
      const oldHeight = oldRatio * naturalHeight
      const $background = this.$refs.background
      const { width: bgWidth, height: bgHeight } = micell.dom.viewport($background)
      const { scrollTop, scrollLeft }  = $background
      const oldCenterXRatio = oldWidth >= bgWidth ? (scrollLeft + bgWidth / 2) / oldWidth : 0.5
      const oldCenterYRatio = oldHeight >= bgHeight ? (scrollTop + bgHeight / 2) / oldHeight : 0.5
      const centerX = oldCenterXRatio * width
      const centerY = oldCenterYRatio * height

      this.$nextTick(() => {
        $background.scrollLeft = centerX - bgWidth / 2
        $background.scrollTop = centerY - bgHeight / 2
      })
    }
  },
  methods: {
    onDrop(e: DragEvent) {
      e.preventDefault()
      const files = []
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i]
        if (item.kind === 'file') {
          files.push(item.getAsFile())
        }
      }
      if (files.length > 0) {
        const firstFile = files[0]
        window.electron.ipcRenderer.send('drop-file', firstFile.path)
      }
    },
    onDragOver(e: DragEvent) {
      e.preventDefault()
    }
  }
})
</script>

<style scoped>
.background {
  display: flex;
  align-items: flex-start;
  height: calc(100vh - 24px);
  overflow: auto;
}

.image {
  margin: auto;
  opacity: 0;
}

.show {
  opacity: 1;
  transition: opacity .15s ease-in;
}

.empty-tip {
  margin: auto;
  color: #aaa;
}
</style>
