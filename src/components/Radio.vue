<template>
  <label class="radio">
    <input
      type="radio"
      :checked="ownChecked"
      :value="value"
      :name="name"
      @change="onChange"
    />
    <slot></slot>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  model: {
    prop: 'checked',
  },
  emits: ['update:checked', 'change'],
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
  },
  setup(props, ctx) {
    const ownChecked = ref(props.checked)
    watch(() => props.checked, (val) => {
      ownChecked.value = val
    })

    const onChange = (val: boolean) => {
      ownChecked.value = val
      ctx.emit('update:checked', val)
      ctx.emit('change', val, props.value)
    }

    return {
      ownChecked,
      onChange,
    }
  },
})
</script>

<style scoped>
.radio {
  display: inline-block;
  margin-right: 8px;
  height: 32px;
  line-height: 32px;
}
</style>