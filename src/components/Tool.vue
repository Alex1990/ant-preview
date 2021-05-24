<template>
    <button class="tool" :title="title">
        <Icon :name="icon" />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
    components: {
        Icon
    },
    props: {
        title: String,
        icon: String
    }
})
</script>

<style scoped>
.tool {
    appearance: none;
    display: block;
    padding: 16px;
    font-size: 24px;
    line-height: 1;
    text-align: center;
    background: transparent;
    border: 0;
    color: inherit;
    transition: background .1s ease-in;
}

.tool:hover,
.tool:focus {
    background: rgba(0,0,0,.3);
    transition: background .1s ease-in;
}
</style>