<template>
    <el-table-column :label="label">
        <template #default="{row}">
            {{ data(row) }}
        </template>
    </el-table-column>
</template>

<script setup>
const {props, merger} = defineProps({
    label: String,
    props: Array,
    merger: {
        type: String,
        default: '/',
    },
    linebreak: Boolean,
})

const data = row => props.map(item => row[item]).join(merger)
</script>

<style scoped>

</style>
