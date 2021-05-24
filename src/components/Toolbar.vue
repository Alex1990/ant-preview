<template>
    <div class="toolbar">
        <div class="toolbar-content">
            <Tool
                v-for="tool in tools"
                :key="tool.icon"
                :icon="tool.icon"
                :title="tool.title"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Tool from './Tool.vue'

export default defineComponent({
    components: {
        Tool
    },
    setup() {
        const tools = ref([
            {
                icon: 'rotate-left',
                title: 'Rotate left by 90°'
            },
            {
                icon: 'rotate-right',
                title: 'Rotate right by 90°'
            },
            {
                icon: 'flip-vertical',
                title: 'Flip vertically'
            },
            {
                icon: 'flip-horizontal',
                title: 'Flip horizontally'
            },
            {
                icon: 'search',
                title: 'Magnifier'
            },
            {
                icon: 'info',
                title: 'Image properties'
            }
        ])
        return {
            tools
        }
    }
})
</script>

<style scoped>
.toolbar {
    position: fixed;
    left: 0;
    bottom: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar-content {
    display: flex;
    padding: 0 16px;
    border-radius: 16px;
    background: rgba(0,0,0,.3);
    color: #fff;
}
</style>
