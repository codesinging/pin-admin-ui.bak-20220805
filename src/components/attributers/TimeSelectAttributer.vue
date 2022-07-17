<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="是否可输入">
            <el-switch v-model="data.editable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="是否显示清除按钮">
            <el-switch v-model="data.clearable"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
            <el-time-select v-model="data.start" editable start="00:00" end="23:30"></el-time-select>
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
            <el-time-select v-model="data.end" editable start="00:00" end="23:30"></el-time-select>
        </el-descriptions-item>
        <el-descriptions-item label="时间间隔">
            <el-time-select v-model="data.step" editable start="00:00" end="06:00" step="00:10"></el-time-select>
        </el-descriptions-item>
        <el-descriptions-item label="时间格式">
            <el-input v-model="data.format"></el-input>
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
