<template>
    <el-table-column :label="label" align="center">
        <template #default="scope">
            <input-updater :scope="scope" :prop="prop"></input-updater>
        </template>
    </el-table-column>
</template>

<script setup>
import InputUpdater from "../updaters/InputUpdater.vue";

defineProps({
    label: String,
    prop: String,
})
</script>

<style scoped>

</style>
