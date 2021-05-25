<template>
  <button class="tool" :title="title" @click="onClick(name)">
    <Icon :name="icon" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from './Icon.vue';

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    name: String,
    title: String,
    icon: String,
  },
  emits: {
    click: null,
  },
  setup(props, ctx) {
    const onClick = (name: string) => {
      ctx.emit('click', name);
    };
    return {
      onClick,
    };
  },
});
</script>

<style scoped>
.tool {
  appearance: none;
  display: block;
  padding: 16px;
  font-size: 24px;
  line-height: 1;
  text-align: center;
  background: transparent;
  border: 0;
  color: inherit;
  transition: background 0.1s ease-in;
  outline: none;
}

.tool:hover {
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.1s ease-in;
}
</style>
