import { Stats } from 'fs'
import { createStore } from 'vuex'

export interface VFile {
  path: string
  name: string
  mime: string
  data: Uint8Array
  stats: Stats
  // TODO: exifr hasn't type definition
  meta: any
}

export interface State {
  file?: VFile
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
  scaleRatios: number[]
  scale: [number, number]
  rotate: number
  propertyInfoVisible: boolean
}

const store = createStore<State>({
  state: {
    file: null,
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    scaleRatios: [0.01, 0.02, 0.05, 0.0625, 0.1, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 50, 100],
    scale: [1, 1],
    rotate: 0,
    propertyInfoVisible: false,
  },
  getters: {
    fitRatio(state) {
      return state.width / state.naturalWidth
    }
  },
  mutations: {
    reset(state) {
      state.file = null
      state.width = 0
      state.height = 0
      state.scale = [1, 1]
      state.rotate = 0
    },
    setFile(state, payload) {
      state.file = payload
    },
    setDimensions(state, { width, height, naturalWidth, naturalHeight }) {
      state.width = width
      state.height = height
      state.naturalWidth = naturalWidth
      state.naturalHeight = naturalHeight
    },
    setScale(state, payload) {
      state.scale = payload
    },
    resetZoom(state) {
      const { width, naturalWidth, scale } = state
      const ratio = width / naturalWidth
      const [x, y] = scale
      return (state.scale = [Math.sign(x) * ratio, Math.sign(y) * ratio])
    },
    zoomIn(state) {
      const { scaleRatios, scale } = state
      const [x, y] = scale
      const ratio = Math.abs(x)
      let index = -1
      for (let i = 0; i < scaleRatios.length; i++) {
        if (ratio === scaleRatios[i]) {
          index = i + 1
          break
        }
        if (ratio < scaleRatios[i]) {
          index = i
          break
        }
      }
      if (index <= scaleRatios.length - 1 && index > 0) {
        const nextRatio = scaleRatios[index]
        state.scale = [Math.sign(x) * nextRatio, Math.sign(y) * nextRatio]
      }
    },
    zoomOut(state) {
      const { scaleRatios, scale } = state
      const [x, y] = scale
      const ratio = Math.abs(x)
      let index = -1
      for (let i = scaleRatios.length - 1; i >= 0; i--) {
        if (ratio === scaleRatios[i]) {
          index = i - 1
          break
        }
        if (ratio > scaleRatios[i]) {
          index = i
          break
        }
      }
      if (index >= 0) {
        const nextRatio = scaleRatios[index]
        state.scale = [Math.sign(x) * nextRatio, Math.sign(y) * nextRatio]
      }
    },
    rotateLeft(state) {
      const { rotate } = state
      state.rotate = rotate > 0 ? rotate - 90 : 270
    },
    rotateRight(state) {
      const { rotate } = state
      state.rotate = rotate < 270 ? rotate + 90 : 0
    },
    flipVertical(state) {
      const { scale } = state
      const [x, y] = scale
      state.scale = [x, -y]
    },
    flipHorizontal(state) {
      const { scale } = state
      const [x, y] = scale
      state.scale = [-x, y]
    },
    openPropertyInfo(state) {
      state.propertyInfoVisible = true
    },
    closePropertyInfo(state) {
      state.propertyInfoVisible = false
    },
    togglePropertyInfo(state) {
      state.propertyInfoVisible = !state.propertyInfoVisible
    },
  },
})

export default store
