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
        <el-tabs v-model="permissionTab" type="card" class="mb-4">
            <el-tab-pane label="页面权限" name="page">
                <el-table ref="pageTable" :data="pages" border table-layout="auto" v-loading="permissionLoading" @selection-change="onPageSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="页面名称" prop="name"></el-table-column>
                    <el-table-column label="页面路径" prop="path"></el-table-column>
                    <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="permission.name"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="菜单权限" name="menu">
                <el-table ref="menuTable" :data="menus" border table-layout="auto" v-loading="permissionLoading" @selection-change="onMenuSelectionChange">
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
            <el-tab-pane label="路由权限" name="route">
                <el-table ref="routeTable" :data="routes" border table-layout="auto" v-loading="permissionLoading" @selection-change="onRouteSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <merged-column label="控制器名-动作名" :props="['controller_name', 'action_name']" merger="-"></merged-column>
                    <merged-column label="控制器-动作" :props="['controller', 'action']" merger="@"></merged-column>
                    <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="permission.name"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

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
        <el-tabs v-model="permissionableTab" type="card">
            <el-tab-pane label="页面权限" name="page">
                <el-table :data="permissionablePages" border table-layout="auto" v-loading="permissionableDialog.loading()">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="页面名称" prop="permissionable.name"></el-table-column>
                    <el-table-column label="页面路径" prop="permissionable.path"></el-table-column>
                    <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="name"></el-table-column>
                    <el-table-column label="权限来源" align="center">
                        <template #default="{row}">
                            <el-tag v-if="row.pivot.model_type==='App\\Models\\AdminUser'">用户</el-tag>
                            <el-tag v-else type="success">角色</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="菜单权限" name="menu">
                <el-table :data="permissionableMenus" border table-layout="auto" v-loading="permissionableDialog.loading()">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="菜单名称" prop="permissionable.name"></el-table-column>
                    <el-table-column label="菜单名称" prop="permissionable.page.name"></el-table-column>
                    <el-table-column label="页面路径" prop="permissionable.page.path"></el-table-column>
                    <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                    <el-table-column label="权限名" prop="name"></el-table-column>
                    <el-table-column label="权限来源" align="center">
                        <template #default="{row}">
                            <el-tag v-if="row.pivot.model_type==='App\\Models\\AdminUser'">用户</el-tag>
                            <el-tag v-else type="success">角色</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="路由权限" name="route">
                <el-table :data="permissionableRoutes" border table-layout="auto" v-loading="permissionableDialog.loading()">
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
                    <el-table-column label="权限来源" align="center">
                        <template #default="{row}">
                            <el-tag v-if="row.pivot.model_type==='App\\Models\\AdminUser'">用户</el-tag>
                            <el-tag v-else type="success">角色</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
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
import {flatten} from "../../utils/tree";
import MergedColumn from "../../components/columns/MergedColumn.vue";

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

const pages = ref([])
const menus = ref([])
const routes = ref([])

const selectedPages = ref([])
const selectedMenus = ref([])
const selectedRoutes = ref([])

const permissions = ref([])

const pageTable = ref()
const menuTable = ref()
const routeTable = ref()

const permissionTab = ref('page')

const openPermissionDialog = row => {
    user.value = row
    permissionDialog.open(`为用户 ${user.value.name} 设置权限`)
    refreshPermissions()
}

const refreshPermissions = () => {
    Promise.all([
        api('admin_users', user.value.id, 'permissions').label('permissions').success(false).get({direct: true}),
        api('admin_pages').label('pages').success(false).list({public: false}),
        api('admin_menus').label('menus').success(false).list({public: false}),
        api('admin_routes').label('routes').success(false).list({public: false}),
    ]).then(responses => {
        permissions.value = responses[0]
        pages.value = responses[1]
        menus.value = flatten(responses[2])
        routes.value = responses[3]

        nextTick(() => initPermissionSelection())
    })
}

const initPermissionSelection = () => {
    const permissionIds = permissions.value.map(item => item.id)

    pages.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => pageTable.value.toggleRowSelection(item, true))
    menus.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => menuTable.value.toggleRowSelection(item, true))
    routes.value.filter(item => permissionIds.includes(item.permission.id)).forEach(item => routeTable.value.toggleRowSelection(item, true))
}

const onPageSelectionChange = selection => selectedPages.value = selection
const onMenuSelectionChange = selection => selectedMenus.value = selection
const onRouteSelectionChange = selection => selectedRoutes.value = selection

const permissionLoading = computed(() => status.any('permissions', 'pages', 'menus', 'routes'))

const savePermissions = () => {
    const permissionIds = [].concat(selectedPages.value.map(item => item.permission.id))
        .concat(selectedMenus.value.map(item => item.permission.id))
        .concat(selectedRoutes.value.map(item => item.permission.id))

    api('admin_users', user.value.id, 'permit').label('save').put({permissions: permissionIds}).then(() => permissionDialog.close())
}

const permissionableDialog = useDialog('查看权限', Permissions)

const openPermissionableDialog = (row) => {
    user.value = row
    permissionableDialog.open(`查看用户 ${user.value.name} 的权限`)
    refreshPermissionables()
}

const permissionables = ref([])
const permissionableTab = ref('page')

const refreshPermissionables = () => {
    api('admin_users', user.value.id, 'permissions').label(permissionableDialog.label).get().then(res => permissionables.value = res)
}

const permissionablePages = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminPage'))
const permissionableMenus = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminMenu'))
const permissionableRoutes = computed(() => permissionables.value.filter(item => item.permissionable_type === 'App\\Models\\AdminRoute'))
</script>

<style scoped>

</style>
