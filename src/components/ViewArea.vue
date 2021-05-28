<template>
  <div class="background" ref="background">
    <img :src="src" class="image" :style="style" ref="image" @load="onLoad" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import micell from 'micell'

export default defineComponent({
  props: {
    src: String,
  },
  setup() {
    const store = useStore()
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
    return {
      scale: computed(() => store.state.scale),
      style,
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
    onLoad() {
      const { width, height } = micell.dom.viewport(this.$refs.background)
      const { naturalWidth, naturalHeight } = this.$refs.image
      const hRatio = width / naturalWidth
      const vRatio = height / naturalHeight
      const ratio = hRatio < vRatio ? hRatio : vRatio
      this.$store.commit('setScale', [ratio, ratio])
      this.$store.commit('setDimensions', { width, height, naturalWidth, naturalHeight })
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
}
</style>
