<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="打开时的文本">
            <el-input v-model="data.activeText"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="关闭时的文本">
            <el-input v-model="data.inactiveText"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="打开时的值">
            <el-input v-model="data.activeValue"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="关闭时的值">
            <el-input v-model="data.inactiveValue"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="图标或文本是否显示在内部">
            <el-switch v-model="data.inlinePrompt"></el-switch>
        </el-descriptions-item>
    </el-descriptions>
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    }
})

const data = ref(props.modelValue ?? {})

const emits = defineEmits(['update:modelValue'])

watch(() => data.value, data => emits('update:modelValue', data), {deep: true})
</script>

<style scoped>

</style>
