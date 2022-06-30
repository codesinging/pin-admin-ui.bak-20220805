<template>
    <el-dialog v-model="modelValue" @close="onClose" :width="width" :top="top" :fullscreen="attrs.fullscreen" v-bind="attributes" destroy-on-close draggable>
        <template #header>
            <div class="flex items-center space-x-2">
                <component v-if="icon" :is="icon"></component>
                <span>{{ title }}</span>
                <loading-icon v-if="loading"/>
            </div>
        </template>
        <slot></slot>
        <template #footer>
            <div class="flex items-center justify-between">
                <div class="flex space-x-2">
                    <el-tooltip content="增大" placement="top">
                        <el-button @click="zoomOut" :disabled="!canZoomOut" circle size="small">
                            <plus/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="缩小" placement="top">
                        <el-button @click="zoomIn" :disabled="!canZoomIn" circle size="small">
                            <minus/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip :content="attrs.fullscreen ? '退出全屏':'全屏显示'" placement="top">
                        <el-button @click="toggleFullscreen" circle size="small">
                            <full-screen/>
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="flex items-center space-x-2">
                    <slot name="actions"></slot>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import {Plus, Minus, FullScreen} from "@icon-park/vue-next";
import LoadingIcon from '../icons/LoadingIcon.vue'
import {useStorage} from "../../utils/storage";
import {computed, getCurrentInstance, reactive} from "vue";

defineProps({
    modelValue: Boolean,
    title: String,
    attributes: Object,
    loading: Boolean,
    icon: Object,
})

const storage = useStorage('component_' + getCurrentInstance().uid)

const attrs = reactive(storage.get({
    width: 60,
    top: 20,
    fullscreen: false,
}))

const width = computed(() => attrs.width + '%')
const top = computed(() => attrs.top + 'vh')

const zoomOut = () => {
    attrs.width += 20
    attrs.top -= 10
    storage.set(attrs)
}

const zoomIn = () => {
    attrs.width -= 20
    attrs.top += 10
    storage.set(attrs)
}

const toggleFullscreen = () => {
    attrs.fullscreen = !attrs.fullscreen
    storage.set(attrs)
}

const canZoomOut = computed(() => attrs.width < 100)
const canZoomIn = computed(() => attrs.width > 40)

const emits = defineEmits(['update:modelValue'])

const onClose = () => {
    emits('update:modelValue', false)
}
</script>

<style scoped>

</style>
