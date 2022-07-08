<template>
    <el-tabs v-model="tab" type="card">
        <el-tab-pane label="页面权限" name="page">
            <el-table :data="pages" border table-layout="auto" v-loading="loading">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column label="页面名称" prop="permissionable.name"></el-table-column>
                <el-table-column label="页面路径" prop="permissionable.path"></el-table-column>
                <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                <el-table-column label="权限名" prop="name"></el-table-column>
                <el-table-column label="权限来源" align="center">
                    <template #default="{row}">
                        <el-tag v-if="fromUser(row)">用户</el-tag>
                        <el-tag v-else type="success">角色</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="菜单权限" name="menu">
            <el-table :data="menus" border table-layout="auto" v-loading="loading">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column label="菜单名称" prop="permissionable.name"></el-table-column>
                <el-table-column label="菜单名称" prop="permissionable.page.name"></el-table-column>
                <el-table-column label="页面路径" prop="permissionable.page.path"></el-table-column>
                <el-table-column label="权限ID" prop="id" align="center"></el-table-column>
                <el-table-column label="权限名" prop="name"></el-table-column>
                <el-table-column label="权限来源" align="center">
                    <template #default="{row}">
                        <el-tag v-if="fromUser(row)">用户</el-tag>
                        <el-tag v-else type="success">角色</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="路由权限" name="route">
            <el-table :data="routes" border table-layout="auto" v-loading="loading">
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
                        <el-tag v-if="fromUser(row)">用户</el-tag>
                        <el-tag v-else type="success">角色</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
    permissions: Array,
    loading: Boolean,
})

const tab = ref('page')

const pages = computed(() => props.permissions.filter(item => item.permissionable_type === 'App\\Models\\AdminPage'))
const menus = computed(() => props.permissions.filter(item => item.permissionable_type === 'App\\Models\\AdminMenu'))
const routes = computed(() => props.permissions.filter(item => item.permissionable_type === 'App\\Models\\AdminRoute'))

const fromUser = row => row.pivot.model_type === 'App\\Models\\AdminUser'

</script>

<style scoped>

</style>
