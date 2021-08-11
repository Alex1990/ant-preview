<template>
  <div class="settings">
    <div class="header">
      <h3>{{ localeData.settings.title }}</h3>
      <button class="close-btn" :title="localeData.settings.closeBtnTitle" @click="close">
        &times;
      </button>
    </div>
    <form class="form">
      <div class="form-item">
        <label>{{ localeData.settings.locale }}</label>
        <select
          v-model="settings.locale"
        >
          <option
            v-for="locale in locales"
            :key="locale.value"
            :value="locale.value"
          >
            {{ locale.label }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label>
          {{ localeData.settings.canvasBackgroundColor }}
        </label>
        <input type="color" v-model="settings.canvasBackgroundColor" />
      </div>
      <div class="form-item">
        <label>{{ localeData.settings.sortBy }}</label>
        <select
          v-model="settings.sortBy"
        >
          <option
            v-for="option in localeData.settings.sortByOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label>
          {{ localeData.settings.sortType }}
        </label>
        <div>
          <Radio
            v-for="option in localeData.settings.sortTypeOptions"
            :key="option.value"
            :value="option.value"
            :checked="option.value === settings.sortType"
            name="sortType"
            @change="onSortTypeChange"
          >
            {{ option.label }}
          </Radio>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { localeOptions } from '../locales/index'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'
import useSettings from '../uses/useSettings'
import { SortType } from '../types/Settings'
import Radio from './Radio.vue'


export default defineComponent({
  components: {
    Radio,
  },
  setup() {
    const locales = ref(localeOptions)
    const settings = useSettings()
    const store = useStore()
    const localeData = computed(() => getBrowserLocaleData(settings.value.locale))
    
    const close = () => store.commit('toggleSettingsVisible')

    onMounted(() => {
      // TODO: move to App.vue
      document.body.style.background = (settings.value.canvasBackgroundColor as string) || ''
    })

    watch(() => settings.value.canvasBackgroundColor, (color: string) => {
      document.body.style.background = color
    })

    const onSortTypeChange = (checked: boolean, value: SortType) => {
      if (checked) {
        settings.value.sortType = value
      }
    }

    return {
      locales,
      localeData,
      settings,
      close,
      onSortTypeChange,
    }
  },
})
</script>

<style scoped>
.settings {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: #f8f8f8;
}

.header {
  position: relative;
  border-bottom: 1px solid #ddd;
}

.header h3 {
  margin: 0;
  padding: 10px 0;
  font-size: 20px;
  font-weight: normal;
  line-height: 1;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 24px;
  background: transparent;
  color: #aaa;
  border: 0;
}

.close-btn:hover {
  color: #666;
  background: rgba(127,127,127,.2);
}

.form {
  padding-top: 24px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.form-item > label {
  margin-right: 32px;
  display: block;
  width: 240px;
  height: 32px;
  line-height: 32px;
  text-align: right;
}

.form-item > label::after {
  content: ':';
}

.form-item input,
.form-item select {
  height: 32px;
}
</style>
