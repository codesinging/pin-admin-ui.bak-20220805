<template>
    <model-view ref="view" resource="admin_actions" hide-add-button hide-edit-button pageable>
        <template #header-actions>
            <el-button type="primary" @click="sync" :loading="status.status.sync" :icon="Sync">同步</el-button>
        </template>
        <template #table-columns>
            <el-table-column label="控制器" prop="controller"></el-table-column>
            <el-table-column label="动作" prop="action"></el-table-column>
            <el-table-column label="控制器名" prop="controller_name"></el-table-column>
            <el-table-column label="动作名" prop="action_name"></el-table-column>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import useStatus from "../../states/status";
import api from "../../utils/api";
import {ref} from "vue";
import {Sync} from "@icon-park/vue-next";

const status = useStatus()

const view = ref()

const sync = () => {
    api('admin_actions/sync').label('sync').put().then(() => view.value.refresh())
}
</script>

<style scoped>

</style>
