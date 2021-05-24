<template>
    <div class="background">
        <img :src="src" class="image" :style="style" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        src: String
    },
    setup() {
        const store = useStore()
        const style = computed(() => {
            return `transform: scale(${store.state.scale})`
        })
        return {
            style
        }
    }
})
</script>

<style scoped>
.background {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
</style>
