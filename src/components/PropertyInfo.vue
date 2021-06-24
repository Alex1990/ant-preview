<template>
  <teleport to="body">
    <div v-if="propertyInfoVisible" class="property-info">
      <div class="title-bar">
        <button class="close-btn" type="button" @click="onClose">
          [x]
        </button>
      </div>
      <ul class="property-list">
        <li v-for="(value, key) in meta" :key="key" class="property-item">
          <span class="property-name">{{ key }}</span>
          <span class="property-value">{{ value }}</span>
        </li>
      </ul>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    return {
      meta: computed(() => store.state.file.meta),
      propertyInfoVisible: computed(() => store.state.propertyInfoVisible),
      onClose: () => store.commit('closePropertyInfo'),
    }
  },
})
</script>

<style scoped>
.property-info {
  position: fixed;
  top: 50px;
  right: 50px;
  width: 300px;
  height: 400px;
  font-size: 12px;
  background: rgba(0,0,0,.75);
  color: #fff;
  overflow: auto;
}

.property-info::-webkit-scrollbar {
  width: 8px;
}
 
.property-info::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
.property-info::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.title-bar {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 20px;
}

.close-btn {
  margin-left: auto;
  margin-right: 0;
  padding: 3px;
  font-size: 14px;
  line-height: 1;
  background: transparent;
  border: 0;
  color: #fff;
}

.close-btn {
  cursor: pointer;
}

.property-list {
  margin: 0;
  padding: 12px 12px 12px 24px;
  line-height: 1.5;
  overflow: auto;
}

.property-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.property-name {
  width: 40%;
  text-align: right;
  color: #ddd;
  word-break: break-all;
}

.property-value {
  width: 55%;
  font-weight: 600;
  color: #fff;
  word-break: break-all;
}
</style>