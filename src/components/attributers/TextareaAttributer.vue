<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="最大输入长度">
            <el-input-number v-model="data.maxlength"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="最小输入长度">
            <el-input-number v-model="data.minlength"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="是否显示输入字数统计">
            <el-switch v-model="data.showWordLimit"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="输入框行数">
            <el-input-number v-model="data.rows"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="高度是否自适应">
            <el-switch v-model="data.autosize"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="输入框占位文本">
            <el-input v-model="data.placeholder"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="缩放控制">
            <el-radio-group v-model="data.resize">
                <el-radio label="none">无</el-radio>
                <el-radio label="both">水平和垂直</el-radio>
                <el-radio label="horizontal">水平</el-radio>
                <el-radio label="vertical">垂直</el-radio>
            </el-radio-group>
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
