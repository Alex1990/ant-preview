import { createStore } from 'vuex'

export interface State {
    scaleRatios: number[]
    scale: number
}

const store = createStore<State>({
    state: {
        scaleRatios: [
            .125,
            .25,
            .5,
            .75,
            1,
            1.25,
            1.5,
            1.75,
            2,
            2.5,
            4,
            8,
            16
        ],
        scale: 1
    },
    mutations: {
        zoomIn(state) {
            const { scaleRatios, scale } = state
            const index = scaleRatios.findIndex(scaleRatio => scale === scaleRatio)
            if (index < scaleRatios.length - 1) {
                state.scale  = scaleRatios[index + 1]
            }
        },
        zoomOut(state) {
            const { scaleRatios, scale } = state
            const index = scaleRatios.findIndex(scaleRatio => scale === scaleRatio)
            if (index > 0) {
                state.scale  = scaleRatios[index - 1]
            }
        }
    }
})

export default store