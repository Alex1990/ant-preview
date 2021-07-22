<template>
  <div class="arrow-nav">
    <button
      class="arrow-btn arrow-prev"
      :class="{['arrow-disabled']: prevDisabled }"
      type="button"
      @click="onPrev"
    >
      <Icon name="arrow-left" />
    </button>
    <button
      class="arrow-btn arrow-next"
      :class="{['arrow-disabled']: nextDisabled }"
      type="button"
      @click="onNext"
    >
      <Icon name="arrow-right" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import basename from 'micell/path/basename'
import dirname from 'micell/path/dirname'
import Icon from './Icon.vue'
import { State } from '../store/index'

export default defineComponent({
  components: {
    Icon,
  },
  setup() {
    const store = useStore<State>()
    const dirFiles = computed(() => store.state.dirFiles)
    const dirName = computed(() => dirname(store.state.file.path))
    const fileName = computed(() => basename(store.state.file.path))
    const index = computed(() => dirFiles.value.findIndex(v => v === fileName.value))
    const onPrev = () => {
      const prevFileName = dirFiles.value[index.value - 1]
      window.electron.ipcRenderer.send('nav-file', `${dirName.value}/${prevFileName}`)
    }
    const onNext = () => {
      const nextFileName = dirFiles.value[index.value + 1]
      window.electron.ipcRenderer.send('nav-file', `${dirName.value}/${nextFileName}`)
    }
    return {
      prevDisabled: computed(() => index.value === 0),
      nextDisabled: computed(() => index.value === dirFiles.value.length - 1),
      onPrev,
      onNext,
    }
  },
})
</script>

<style scoped>
.arrow-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.arrow-btn {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
  width: 64px;
  height: 64px;
  font-size: 36px;
  background: rgba(0,0,0,.6);
  opacity: 0.3;
  border: 0;
  border-radius: 32px;
  color: #fff;
  user-select: none;
  pointer-events: visible;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.arrow-btn:hover {
  opacity: 0.7;
  transition: all 0.2s ease-in;
}

.arrow-disabled {
  display: none;
}
</style>