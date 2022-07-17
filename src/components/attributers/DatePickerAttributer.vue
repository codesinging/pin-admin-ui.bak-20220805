<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="是否可输入">
            <el-switch v-model="data.editable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="是否显示清除按钮">
            <el-switch v-model="data.clearable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="显示在输入框中的格式">
            <el-input v-model="data.format"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="绑定值的格式">
            <el-input v-model="data.valueFormat"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="显示类型" :span="2">
            <el-radio-group v-model="data.type">
                <el-radio label="date">日期</el-radio>
                <el-radio label="month">月份</el-radio>
                <el-radio label="year">年份</el-radio>
                <el-radio label="week">周</el-radio>
            </el-radio-group>
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
        default: () => ({
            type: 'date',
        })
    }
})

const data = ref(props.modelValue ?? {})

const emits = defineEmits(['update:modelValue'])

watch(() => data.value, data => emits('update:modelValue', data), {deep: true})
</script>

<style scoped>

</style>
