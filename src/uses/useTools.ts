import { Ref, computed } from 'vue'
import useSettings from '../uses/useSettings'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'

export interface Tool {
  name: string
  title: string
  icon: string
}

export default function useTools(): Ref<Tool[]> {
  const settings = useSettings()
  const localeData = computed(() => getBrowserLocaleData(settings.value.locale))

  const tools = computed(() => {
    return [
      {
        name: 'rotateLeft',
        title: localeData.value.toolbar.rotateLeft.title,
        icon: 'rotate-left',
      },
      {
        name: 'rotateRight',
        title: localeData.value.toolbar.rotateRight.title,
        icon: 'rotate-right',
      },
      {
        name: 'flipVertical',
        title: localeData.value.toolbar.flipVertical.title,
        icon: 'flip-vertical',
      },
      {
        name: 'flipHorizontal',
        title: localeData.value.toolbar.flipHorizontal.title,
        icon: 'flip-horizontal',
      },
      {
        name: 'resetZoom',
        title: localeData.value.toolbar.resetZoom.title,
        icon: 'search',
      },
      {
        name: 'zoomOut',
        title: localeData.value.toolbar.zoomOut.title,
        icon: 'zoom-out',
      },
      {
        name: 'zoomIn',
        title: localeData.value.toolbar.zoomIn.title,
        icon: 'zoom-in',
      },
      {
        name: 'propertyInfo',
        title: localeData.value.toolbar.propertyInfo.title,
        icon: 'info',
      },
    ]
  })
  return tools
}
