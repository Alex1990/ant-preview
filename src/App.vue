<template>
    <div>Hello, World!</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'

export default defineComponent({
    setup() {
        const params = useUrlSearchParams('history')
        console.log(params)
        return params
    }
})
</script>
