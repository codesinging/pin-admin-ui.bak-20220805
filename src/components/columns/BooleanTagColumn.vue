<template>
    <el-table-column :label="label" align="center">
        <template #default="{row}">
            <el-tag :type="row[prop] ? trueType : falseType">{{ row[prop] ? trueText : falseText }}</el-tag>
        </template>
    </el-table-column>
</template>

<script setup>
const props = defineProps({
    label: String,
    prop: String,
    trueType: {
        type: String,
        default: 'success',
    },
    falseType: {
        type: String,
        default: 'danger',
    },
    trueText: {
        type: String,
        default: '是',
    },
    falseText: {
        type: String,
        default: '否',
    },
})
</script>

<style scoped>

</style>
