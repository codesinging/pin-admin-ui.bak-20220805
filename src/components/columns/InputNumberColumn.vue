<template>
    <el-table-column :label="label" align="center">
        <template #default="scope">
            <input-number-updater :scope="scope" :prop="prop"></input-number-updater>
        </template>
    </el-table-column>
</template>

<script setup>
import InputNumberUpdater from "../updaters/InputNumberUpdater.vue";

defineProps({
    label: String,
    prop: String,
})
</script>

<style scoped>

</style>
