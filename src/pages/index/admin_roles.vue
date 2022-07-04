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
        <el-tabs v-model="giveTab" type="card">
            <el-tab-pane label="页面权限" name="page">
                <el-table ref="pageTable" :data="pages" border table-layout="auto" v-loading="giveDialogLoading" @selection-change="onPageSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="页面名称" prop="name"></el-table-column>
                    <el-table-column label="页面路径" prop="path"></el-table-column>
                    <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="permission.name"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="菜单权限" name="menu">
                <el-table ref="menuTable" :data="menus" border table-layout="auto" v-loading="giveDialogLoading" @selection-change="onMenuSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="菜单名称">
                        <template #default="{row}">
                            <span v-for="i in row.depth" class="inline-block w-4"></span>
                            <span>{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="页面名称" prop="page.name"></el-table-column>
                    <el-table-column label="页面路径" prop="page.path"></el-table-column>
                    <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="permission.name"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="动作权限" name="action">
                <el-table ref="actionTable" :data="actions" border table-layout="auto" v-loading="giveDialogLoading" @selection-change="onActionSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <merged-column label="控制器名-动作名" :props="['controller_name', 'action_name']" merger="-"></merged-column>
                    <merged-column label="控制器-动作" :props="['controller', 'action']" merger="@"></merged-column>
                    <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="permission.name"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

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
        <el-tabs v-model="viewTab" type="card">
            <el-tab-pane label="页面权限" name="page">
                <el-table :data="permissionablePages" border table-layout="auto" v-loading="viewDialog.loading()">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="页面名称" prop="permissionable.name"></el-table-column>
                    <el-table-column label="页面路径" prop="permissionable.path"></el-table-column>
                    <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="name"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="菜单权限" name="menu">
                <el-table :data="permissionableMenus" border table-layout="auto" v-loading="viewDialog.loading()">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="菜单名称" prop="permissionable.name"></el-table-column>
                    <el-table-column label="菜单名称" prop="permissionable.page.name"></el-table-column>
                    <el-table-column label="页面路径" prop="permissionable.page.path"></el-table-column>
                    <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="name"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="动作权限" name="action">
                <el-table :data="permissionableActions" border table-layout="auto" v-loading="viewDialog.loading()">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="控制器名-动作名">
                        <template #default="{row}">
                            {{ row.permissionable.controller_name }}-{{ row.permissionable.action_name }}
                        </template>
                    </el-table-column>
                    <el-table-column label="控制器-动作">
                        <template #default="{row}">
                            {{ row.permissionable.controller }}@{{ row.permissionable.action }}
                        </template>
                    </el-table-column>
                    <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="name"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
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
import {computed, nextTick, ref} from "vue";
import ExtendedDialog from "../../components/extensions/ExtendedDialog.vue";
import api from "../../utils/api";
import MergedColumn from "../../components/columns/MergedColumn.vue";
import useStatus from "../../states/status";
import {flatten} from "../../utils/tree";

const status = useStatus()

const giveDialog = useDialog('设置权限', Permissions)

const role = ref(null)

const permissions = ref([])

const pages = ref([])
const menus = ref([])
const actions = ref([])

const selectedPages = ref([])
const selectedMenus = ref([])
const selectedActions = ref([])

const pageTable = ref()
const menuTable = ref()
const actionTable = ref()

const giveTab = ref('page')

const openGiveDialog = row => {
    role.value = row
    giveDialog.open(`给角色 ${row.name} 设置权限`)
    refreshPermissions()
}

const refreshPermissions = () => {
    Promise.all([
        api('admin_roles', role.value.id, 'permissions').label('permissions').success(false).get(),
        api('admin_pages').label('pages').success(false).list({public: false}),
        api('admin_menus').label('menus').success(false).list({public: false}),
        api('admin_actions').label('actions').success(false).list(),
    ]).then(responses => {
        permissions.value = responses[0]
        pages.value = responses[1]
        menus.value = flatten(responses[2])
        actions.value = responses[3]

        nextTick(() => initPermissionSelection())
    })
}

const initPermissionSelection = () => {
    const permissionIds = permissions.value.map(item => item.id)

    pages.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => pageTable.value.toggleRowSelection(item, true))
    menus.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => menuTable.value.toggleRowSelection(item, true))
    actions.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => actionTable.value.toggleRowSelection(item, true))
}

const onPageSelectionChange = selection => selectedPages.value = selection
const onMenuSelectionChange = selection => selectedMenus.value = selection
const onActionSelectionChange = selection => selectedActions.value = selection

const giveDialogLoading = computed(() => status.any('permissions', 'pages', 'menus', 'actions'))

const savePermissions = () => {
    const permissionIds = [].concat(selectedPages.value.map(item => item.permission.id))
        .concat(selectedMenus.value.map(item => item.permission.id))
        .concat(selectedActions.value.map(item => item.permission.id))

    api('admin_roles', role.value.id, 'permit').label('save').put({permissions: permissionIds}).then(() => giveDialog.close())
}

const viewDialog = useDialog('查看权限', Permissions)

const openViewDialog = row => {
    role.value = row
    viewDialog.open(`查看角色 ${role.value.name} 的权限`)
    refreshPermissionables()
}

const permissionables = ref([])
const viewTab = ref('page')

const refreshPermissionables = () => {
    api('admin_roles', role.value.id, 'permissions').label(viewDialog.label).get().then(res => permissionables.value = res)
}

const permissionablePages = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminPage'))
const permissionableMenus = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminMenu'))
const permissionableActions = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminAction'))

</script>

<style scoped>

</style>
