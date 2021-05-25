<template>
    <span class="iconfont" :class="`icon-${name}`"></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: String
  }
})
</script>
