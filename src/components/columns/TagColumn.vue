<template>
    <el-table-column :label="label" align="center">
        <template #default="{row}">
            <el-tag :type="types[row[prop]]">{{ texts[row[prop]] ?? row[prop] }}</el-tag>
        </template>
    </el-table-column>
</template>

<script setup>
const props = defineProps({
    label: String,
    prop: String,
    types: {
        type: Object,
        default: () => ({})
    },
    texts: {
        type: Object,
        default: () => ({}),
    },
})
</script>

<style scoped>

</style>
