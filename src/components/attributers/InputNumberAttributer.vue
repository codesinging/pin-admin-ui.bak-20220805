<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="最小值">
            <el-input-number v-model="data.min"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="最大值">
            <el-input-number v-model="data.max"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="步长">
            <el-input-number v-model="data.step"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="数值精度">
            <el-input-number v-model="data.precision"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="是否只能输入步长的倍数">
            <el-switch v-model="data.stepStrictly"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="输入框占位文本">
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
