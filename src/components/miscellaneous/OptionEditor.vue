<template>
    <div class="space-y-2 w-full">
        <el-table :data="options" border table-layout="auto">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="选项值" align="center">
                <template #default="{row}">
                    <el-input v-model="row.value"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="选项文本" align="center">
                <template #default="{row}">
                    <el-input v-model="row.text"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{$index}">
                    <el-button type="primary" size="small" @click="add($index)">增加</el-button>
                    <el-button type="danger" size="small" @click="remove($index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-end space-x-2">
            <el-button type="primary" @click="add" class="w-full">增加</el-button>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    valueType: {
        type: String,
        default: 'string',
    }
})

const options = ref(props.modelValue ?? [])

const emits = defineEmits(['update:modelValue'])

const remove = index => options.value.splice(index, 1)

const add = (index) => {
    if (typeof index !== 'number') {
        options.value.push({value: '', text: ''})
    } else {
        options.value = options.value.slice(0, index).concat([{value: '', text: ''}]).concat(options.value.slice(index))
    }
}

watch(() => options.value, options => emits('update:modelValue', options.filter(item => item.value !== '')), {deep: true})
</script>

<style scoped>

</style>
