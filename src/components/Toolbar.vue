<template>
    <div class="toolbar">
        <div class="toolbar-content">
            <Tool
                v-for="tool in tools"
                :key="tool.icon"
                :name="tool.name"
                :icon="tool.icon"
                :title="tool.title"
                @click="onToolClick"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import Tool from './Tool.vue'

export default defineComponent({
    components: {
        Tool
    },
    setup() {
        const tools = ref([
            {
                name: 'rotateLeft',
                title: 'Rotate left by 90°',
                icon: 'rotate-left'
            },
            {
                name: 'rotateRight',
                title: 'Rotate right by 90°',
                icon: 'rotate-right'
            },
            {
                name: 'flipVertical',
                title: 'Flip vertically',
                icon: 'flip-vertical'
            },
            {
                name: 'flipHorizontal',
                title: 'Flip horizontally',
                icon: 'flip-horizontal'
            },
            {
                name: 'mgnifier',
                title: 'Magnifier',
                icon: 'search'
            },
            {
                name: 'zoomOut',
                title: 'Zoom out',
                icon: 'zoom-out'
            },
            {
                name: 'zoomIn',
                title: 'Zoom in',
                icon: 'zoom-in'
            },
            {
                name: 'inspector',
                title: 'View image properties',
                icon: 'info'
            }
        ])
        const store = useStore()
        const onToolClick = (name: string) => {
            console.log(name)
            switch (name) {
                case 'zoomIn':
                    store.commit('zoomIn')
                    break
                case 'zoomOut':
                    store.commit('zoomOut')
                    break
                default:
                    console.error('unknown command')
            }
        }
        return {
            tools,
            onToolClick,
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
