<template>
    <model-view resource="admin_roles">
        <template #table-columns>
            <name-column/>
            <el-table-column label="描述" prop="description"></el-table-column>
            <sort-column/>
            <status-column/>
            <el-table-column label="权限" align="center">
                <template #default="{row}">
                    <el-button link type="primary" size="small" @click="openGiveDialog(row)">设置权限</el-button>
                    <el-button link type="primary" size="small" @click="openViewDialog(row)">查看权限</el-button>
                </template>
            </el-table-column>
        </template>

        <template #form-items="{data}">
            <el-form-item label="名称" prop="name" :rules="[{required: true, message: '名称不能为空'}]">
                <el-input v-model="data.name" autofocus></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="data.description"></el-input>
            </el-form-item>
            <el-form-item label="排列序号" prop="sort">
                <el-input-number v-model="data.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="data.status"></el-switch>
            </el-form-item>
        </template>
    </model-view>

    <extended-dialog
        v-model="giveDialog.states.visible"
        :title="giveDialog.states.title"
        :subtitle="giveDialog.states.subtitle"
        :icon="giveDialog.icon"
        :loading="giveDialogLoading"
        :width="80"
        :top="20"
    >
        <permissions-selector v-model="permissionIds"></permissions-selector>

        <template #actions>
            <el-button @click="giveDialog.close()">取消</el-button>
            <el-button type="primary" @click="savePermissions" :loading="status.status.save">保存</el-button>
        </template>
    </extended-dialog>

    <extended-dialog
        v-model="viewDialog.states.visible"
        :title="viewDialog.states.title"
        :subtitle="viewDialog.states.subtitle"
        :icon="viewDialog.icon"
        :loading="viewDialog.loading()"
        :width="80"
        :top="20"
    >
        <permissions-viewer :permissions="permissionables" :loading="viewDialog.loading()"></permissions-viewer>
        <template #actions>
            <el-button @click="viewDialog.close()">关闭</el-button>
        </template>
    </extended-dialog>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import NameColumn from "../../components/columns/NameColumn.vue";
import SortColumn from "../../components/columns/SortColumn.vue";
import StatusColumn from "../../components/columns/StatusColumn.vue";
import useDialog from "../../utils/dialog";
import {Permissions} from "@icon-park/vue-next";
import {computed, ref} from "vue";
import ExtendedDialog from "../../components/extensions/ExtendedDialog.vue";
import api from "../../utils/api";
import useStatus from "../../states/status";
import PermissionsViewer from "../../components/miscellaneous/PermissionsViewer.vue";
import PermissionsSelector from "../../components/miscellaneous/PermissionsSelector.vue";

const status = useStatus()

const giveDialog = useDialog('设置权限', Permissions)

const role = ref(null)

const permissionIds = ref([])

const openGiveDialog = row => {
    role.value = row
    giveDialog.open(`给角色 ${row.name} 设置权限`)
    refreshPermissions()
}

const refreshPermissions = () => {
    api('admin_roles', role.value.id, 'permissions').label('permissions').success(false).get().then(res => permissionIds.value = res.map(item => item.id))
}

const giveDialogLoading = computed(() => status.status.permissions)

const savePermissions = () => {
    api('admin_roles', role.value.id, 'permit').label('save').put({permissions: permissionIds.value}).then(() => giveDialog.close())
}

const viewDialog = useDialog('查看权限', Permissions)

const openViewDialog = row => {
    role.value = row
    viewDialog.open(`查看角色 ${role.value.name} 的权限`)
    refreshPermissionables()
}

const permissionables = ref([])

const refreshPermissionables = () => {
    api('admin_roles', role.value.id, 'permissions').label(viewDialog.label).get().then(res => permissionables.value = res)
}

</script>

<style scoped>

</style>
