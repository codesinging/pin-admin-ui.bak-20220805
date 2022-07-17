<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="是否显示清空选项">
            <el-switch v-model="data.clearable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="是否可筛选">
            <el-switch v-model="data.filterable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="是否将选中值按文字的形式展示">
            <el-switch v-model="data.collapseTags"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="最多可以选择的项目数">
            <el-input-number v-model="data.multipleLimit" :min="2"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="占位文本">
            <el-input v-model="data.placeholder"></el-input>
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
