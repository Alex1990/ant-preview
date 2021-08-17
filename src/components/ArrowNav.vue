<template>
  <div class="arrow-nav">
    <button
      class="arrow-btn arrow-prev"
      :class="{['arrow-disabled']: prevDisabled, ['arrow-hidden']: prevHidden}"
      type="button"
      @click="onPrev"
      @mouseenter="onPrevMouseEnter"
      @mouseleave="onPrevMouseLeave"
    >
      <Icon name="arrow-left" />
    </button>
    <button
      class="arrow-btn arrow-next"
      :class="{['arrow-disabled']: nextDisabled, ['arrow-hidden']: nextHidden}"
      type="button"
      @click="onNext"
      @mouseenter="onNextMouseEnter"
      @mouseleave="onNextMouseLeave"
    >
      <Icon name="arrow-right" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import basename from 'micell/path/basename'
import dirname from 'micell/path/dirname'
import { State } from '../store/index'
import useSettings from '../uses/useSettings'
import Icon from './Icon.vue'

export default defineComponent({
  components: {
    Icon,
  },
  setup() {
    const store = useStore<State>()
    const settings = useSettings()
    const dirFiles = computed(() => {
      return _.orderBy(store.state.dirFiles, [settings.value.sortBy], [settings.value.sortType])
    })
    const filePath = computed(() => {
      const { openFailedFile, file } = store.state
      return openFailedFile ? openFailedFile : file.path
    })
    const dirName = computed(() => dirname(filePath.value))
    const fileName = computed(() => basename(filePath.value))
    const index = computed(() => dirFiles.value.findIndex(v => v.fileName === fileName.value))
    const onPrev = () => {
      if (index.value > 0) {
        const prevFileName = dirFiles.value[index.value - 1].fileName
        window.electron.ipcRenderer.send('nav-file', `${dirName.value}/${prevFileName}`)
      }
    }
    const onNext = () => {
      if (index.value < dirFiles.value.length - 1) {
        const nextFileName = dirFiles.value[index.value + 1].fileName
        window.electron.ipcRenderer.send('nav-file', `${dirName.value}/${nextFileName}`)
      }
    }

    window.electron.ipcRenderer.on('menuItem', (id: string) => {
      if (id === 'prev') {
        onPrev()
      }
      if (id === 'next') {
        onNext()
      }
    })

    const prevHidden = ref(true)
    const onPrevMouseEnter = () => {
      prevHidden.value = false;
    }
    const onPrevMouseLeave = () => {
      prevHidden.value = true;
    }

    const nextHidden = ref(true)
    const onNextMouseEnter = () => {
      nextHidden.value = false;
    }
    const onNextMouseLeave = () => {
      nextHidden.value = true;
    }

    return {
      prevDisabled: computed(() => index.value === 0),
      nextDisabled: computed(() => index.value === dirFiles.value.length - 1),
      prevHidden,
      nextHidden,
      onPrev,
      onNext,
      onPrevMouseEnter,
      onPrevMouseLeave,
      onNextMouseEnter,
      onNextMouseLeave,
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
  opacity: 0.7;
  border: 0;
  border-radius: 32px;
  color: #fff;
  user-select: none;
  pointer-events: visible;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.arrow-hidden {
  opacity: 0;
  transition: all 0.2s ease-in;
}

.arrow-disabled {
  visibility: hidden;
  pointer-events: none;
}
</style>