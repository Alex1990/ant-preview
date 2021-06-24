import { ref, Ref } from 'vue'
import { getBrowserLocaleData } from '../utils/getBrowserLocaleData'

export interface Tool {
  name: string
  title: string
  icon: string
}

const localeData = getBrowserLocaleData()

export default function useTools(): Ref<Tool[]> {
  const tools = ref([
    {
      name: 'rotateLeft',
      title: localeData.toolbar.rotateLeft.title,
      icon: 'rotate-left',
    },
    {
      name: 'rotateRight',
      title: localeData.toolbar.rotateRight.title,
      icon: 'rotate-right',
    },
    {
      name: 'flipVertical',
      title: localeData.toolbar.flipVertical.title,
      icon: 'flip-vertical',
    },
    {
      name: 'flipHorizontal',
      title: localeData.toolbar.flipHorizontal.title,
      icon: 'flip-horizontal',
    },
    {
      name: 'resetZoom',
      title: localeData.toolbar.resetZoom.title,
      icon: 'search',
    },
    {
      name: 'zoomOut',
      title: localeData.toolbar.zoomOut.title,
      icon: 'zoom-out',
    },
    {
      name: 'zoomIn',
      title: localeData.toolbar.zoomIn.title,
      icon: 'zoom-in',
    },
    {
      name: 'propertyInfo',
      title: localeData.toolbar.propertyInfo.title,
      icon: 'info',
    },
  ])
  return tools
}
