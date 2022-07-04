<template>
    <el-table-column :label="label" prop="created_at" align="center"></el-table-column>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: '创建时间'
    },
})
</script>

<style scoped>

</style>
