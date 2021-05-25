import { createStore } from 'vuex'

export interface State {
  scaleRatios: number[]
  scale: [number, number]
  rotate: number
}

const store = createStore<State>({
  state: {
    scaleRatios: [0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 4, 8, 16],
    scale: [1, 1],
    rotate: 0,
  },
  mutations: {
    resetZoom(state) {
      const { scale } = state
      const [x, y] = scale
      return (state.scale = [Math.sign(x), Math.sign(y)])
    },
    zoomIn(state) {
      const { scaleRatios, scale } = state
      const [x, y] = scale
      const ratio = Math.abs(x)
      const index = scaleRatios.findIndex((scaleRatio) => ratio === scaleRatio)
      if (index < scaleRatios.length - 1) {
        const nextRatio = scaleRatios[index + 1]
        state.scale = [Math.sign(x) * nextRatio, Math.sign(y) * nextRatio]
      }
    },
    zoomOut(state) {
      const { scaleRatios, scale } = state
      const [x, y] = scale
      const ratio = Math.abs(x)
      const index = scaleRatios.findIndex((scaleRatio) => ratio === scaleRatio)
      if (index > 0) {
        const nextRatio = scaleRatios[index - 1]
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
  },
})

export default store
