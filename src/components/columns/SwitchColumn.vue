<template>
    <el-table-column :label="label" align="center">
        <template #default="scope">
            <switch-updater :scope="scope" :prop="prop"></switch-updater>
        </template>
    </el-table-column>
</template>

<script setup>
import SwitchUpdater from "../updaters/SwitchUpdater.vue";

defineProps({
    label: String,
    prop: String,
})
</script>

<style scoped>

</style>
