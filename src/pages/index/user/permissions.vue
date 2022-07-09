<template>
    <el-card v-if="auth.user.super" header="权限列表">
        <el-result title="超级管理员" sub-title="你的身份是超级管理员，拥有全部权限"></el-result>
    </el-card>

    <el-card v-else>
        <template #header>
            <div class="flex items-center justify-between">
                <span>权限列表</span>
                <el-button type="primary" size="small" @click="refresh" :loading="status.status.refresh">刷新</el-button>
            </div>
        </template>
        <permissions-viewer :permissions="permissions" :loading="status.status.refresh"></permissions-viewer>
    </el-card>
</template>

<script setup>
import {ref} from "vue";
import api from "../../../utils/api.js";
import useAuth from "../../../states/auth.js";
import useStatus from "../../../states/status.js";
import PermissionsViewer from "../../../components/miscellaneous/PermissionsViewer.vue";

const auth = useAuth()
const status = useStatus()

const permissions = ref([])

const refresh = () => {
    api('auth/permissions').label('refresh').get().then(res => permissions.value = res)
}

refresh()
</script>

<style scoped>

</style>
