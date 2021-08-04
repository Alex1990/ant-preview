<template>
  <div class="container">
    <p>{{ localeData.errors.unsupportFormat }}: {{ failedFile }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'

export default defineComponent({
  props: {
    failedFile: {
      type: String,
      required: true,
    },
  },
  setup() {
    const localeData = ref(getBrowserLocaleData())
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