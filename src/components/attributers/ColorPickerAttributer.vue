<template>
    <el-descriptions :column="1" border class="w-full">
        <el-descriptions-item label="是否支持透明度选择">
            <el-switch v-model="data.showAlpha"></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="颜色格式">
            <el-radio-group v-model="data.colorFormat">
                <el-radio label="hsl"></el-radio>
                <el-radio label="hsv"></el-radio>
                <el-radio label="hex"></el-radio>
                <el-radio label="rgb"></el-radio>
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
