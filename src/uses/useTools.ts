import { ref, Ref } from 'vue'

export interface Tool {
  name: string
  title: string
  icon: string
}

export default function useTools(): Ref<Tool[]> {
  const tools = ref([
    {
      name: 'rotateLeft',
      title: 'Rotate left by 90°',
      icon: 'rotate-left',
    },
    {
      name: 'rotateRight',
      title: 'Rotate right by 90°',
      icon: 'rotate-right',
    },
    {
      name: 'flipVertical',
      title: 'Flip vertically',
      icon: 'flip-vertical',
    },
    {
      name: 'flipHorizontal',
      title: 'Flip horizontally',
      icon: 'flip-horizontal',
    },
    {
      name: 'resetZoom',
      title: 'Reset zoom',
      icon: 'search',
    },
    {
      name: 'zoomOut',
      title: 'Zoom out',
      icon: 'zoom-out',
    },
    {
      name: 'zoomIn',
      title: 'Zoom in',
      icon: 'zoom-in',
    },
    {
      name: 'inspector',
      title: 'View image properties',
      icon: 'info',
    },
  ])
  return tools
}
