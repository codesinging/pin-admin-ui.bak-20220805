<template>
    <model-view resource="admin_users" ref="view">
        <template #table-columns>
            <name-column/>
            <el-table-column label="登录账号" prop="username"></el-table-column>
            <el-table-column label="角色" align="center">
                <template #default="{row}">
                    <div class="space-x-1">
                        <el-tag v-for="role in row.roles" :key="role.id" size="small">{{ role.name }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <status-column/>
            <el-table-column label="角色和权限" align="center">
                <template #default="{row}">
                    <div v-if="!row.super" class="space-x-1">
                        <el-button size="small" link type="primary" @click="openRoleDialog(row)">分配角色</el-button>
                        <el-button size="small" link type="primary" @click="openPermissionDialog(row)">设置权限</el-button>
                        <el-button size="small" link type="primary" @click="openPermissionableDialog(row)">查看权限</el-button>
                    </div>
                </template>
            </el-table-column>
        </template>

        <template #form-items="{data, isUpdate}">
            <el-form-item label="登录账号" prop="username" :rules="[{required: true, message: '账号不能为空'}]">
                <el-input v-model="data.username"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name" :rules="[{required: true, message: '名称不能为空'}]">
                <el-input v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" :rules="isUpdate ? [] : [{required: true, message: '密码不能为空'}]">
                <el-input v-model="data.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="data.status"></el-switch>
            </el-form-item>
        </template>
    </model-view>

    <extended-dialog v-model="roleDialog.states.visible" :title="roleDialog.states.title" :subtitle="roleDialog.states.subtitle" :icon="roleDialog.icon" :loading="roleDialog.loading()">
        <el-table ref="roleTable" :data="roles" border table-layout="auto" v-loading="roleDialog.loading()" @selection-change="onRoleSelectionChange">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="name"></el-table-column>
            <el-table-column label="角色描述" prop="description"></el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
        </el-table>

        <template #actions>
            <el-button @click="roleDialog.close()">取消</el-button>
            <el-button type="primary" @click="saveRoles" :loading="status.status.save">保存</el-button>
        </template>
    </extended-dialog>

    <extended-dialog
        v-model="permissionDialog.states.visible"
        :title="permissionDialog.states.title"
        :subtitle="permissionDialog.states.subtitle"
        :icon="permissionDialog.icon"
        :loading="permissionLoading"
        :width="80"
        :top="20"
    >
        <permissions-selector v-model="permissionIds"></permissions-selector>

        <el-alert type="warning" :closable="false">注：此处是为用户设置直接权限，推荐通过角色为用户设置权限。</el-alert>

        <template #actions>
            <el-button @click="permissionDialog.close()">取消</el-button>
            <el-button type="primary" @click="savePermissions" :loading="status.status.save">保存</el-button>
        </template>
    </extended-dialog>

    <extended-dialog
        v-model="permissionableDialog.states.visible"
        :title="permissionableDialog.states.title"
        :subtitle="permissionableDialog.states.subtitle"
        :icon="permissionableDialog.icon"
        :loading="permissionableDialog.loading()"
        :width="80"
        :top="20"
    >
        <permissions-viewer :permissions="permissionables" :loading="permissionableDialog.loading()"></permissions-viewer>

        <template #actions>
            <el-button @click="permissionableDialog.close()">关闭</el-button>
        </template>
    </extended-dialog>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import NameColumn from "../../components/columns/NameColumn.vue";
import StatusColumn from "../../components/columns/StatusColumn.vue";
import {computed, nextTick, ref} from "vue";
import useStatus from "../../states/status";
import useDialog from "../../utils/dialog";
import {Peoples, Permissions} from "@icon-park/vue-next";
import ExtendedDialog from "../../components/extensions/ExtendedDialog.vue";
import api from "../../utils/api";
import PermissionsViewer from "../../components/miscellaneous/PermissionsViewer.vue";
import PermissionsSelector from "../../components/miscellaneous/PermissionsSelector.vue";

const status = useStatus()

const view = ref()

const user = ref({})

const roleDialog = useDialog('分配角色', Peoples)
const roles = ref([])
const selectedRoles = ref([])
const roleTable = ref()

const openRoleDialog = row => {
    user.value = row
    roleDialog.open(`为用户 ${user.value.name} 分配角色`)
    refreshRoles()
}

const refreshRoles = () => {
    api('admin_roles').label(roleDialog.label).list().then(res => {
        roles.value = res
        nextTick(() => initRoleSelection())
    })
}

const initRoleSelection = () => {
    const userRoleIds = user.value.roles.map(item => item.id)
    roles.value.filter(item => userRoleIds.includes(item.id)).forEach(item => roleTable.value.toggleRowSelection(item, true))
}

const onRoleSelectionChange = selection => selectedRoles.value = selection

const saveRoles = () => {
    api('admin_users', user.value.id, 'assign').label('save').put({roles: selectedRoles.value.map(item => item.id)}).then(() => {
        roleDialog.close()
        view.value.refresh()
    })
}

const permissionDialog = useDialog('设置权限', Permissions)

const permissionIds = ref([])

const openPermissionDialog = row => {
    user.value = row
    permissionDialog.open(`为用户 ${user.value.name} 设置权限`)
    refreshPermissions()
}

const refreshPermissions = () => {
    api('admin_users', user.value.id, 'permissions').label('permissions').success(false).get({direct: true}).then(res => permissionIds.value = res.map(item => item.id))
}

const permissionLoading = computed(() => status.status.permissions)

const savePermissions = () => {
    api('admin_users', user.value.id, 'permit').label('save').put({permissions: permissionIds.value}).then(() => permissionDialog.close())
}

const permissionableDialog = useDialog('查看权限', Permissions)

const openPermissionableDialog = (row) => {
    user.value = row
    permissionableDialog.open(`查看用户 ${user.value.name} 的权限`)
    refreshPermissionables()
}

const permissionables = ref([])

const refreshPermissionables = () => {
    api('admin_users', user.value.id, 'permissions').label(permissionableDialog.label).get().then(res => permissionables.value = res)
}
</script>

<style scoped>

</style>
