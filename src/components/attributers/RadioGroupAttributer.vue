<template>
    <el-descriptions :column="2" border class="w-full">
        <el-descriptions-item label="是否显示边框" label-class-name="w-60">
            <el-switch v-model="data.border"></el-switch>
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
