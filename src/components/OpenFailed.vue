<template>
  <div class="container">
    <p>{{ localeData.errors.unsupportFormat }}: {{ failedFile }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import useSettings from '../uses/useSettings'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'

export default defineComponent({
  props: {
    failedFile: {
      type: String,
      required: true,
    },
  },
  setup() {
    const settings = useSettings()
    const localeData = computed(() => getBrowserLocaleData(settings.value.locale))
    return {
      localeData,
    }
  },
})
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>