<template>
  <div class="background">
    <img :src="src" class="image" :style="style" ref="image" @load="onLoad" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    src: String,
  },
  setup() {
    const store = useStore()
    const style = computed(() => {
      const { scale, rotate } = store.state
      const [x, y] = scale
      return `transform: scale(${x},${y}) rotate(${rotate}deg)`
    })
    return {
      style,
    }
  },
  methods: {
    onLoad() {
      const { clientWidth, clientHeight } = this.$refs.image
      this.$store.commit('setWidth', clientWidth)
      this.$store.commit('setHeight', clientHeight)
    }
  }
})
</script>

<style scoped>
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 24px);
  overflow: auto;
}

.image {
  max-width: 100vw;
  max-height: 100vh;
}
</style>
