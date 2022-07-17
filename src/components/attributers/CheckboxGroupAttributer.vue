<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="可选最小数量">
            <el-input-number v-model="data.min" :min="1"></el-input-number>
        </el-descriptions-item>
        <el-descriptions-item label="可选最大数量">
            <el-input-number v-model="data.max"></el-input-number>
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
