<template>
    <el-card>
        <template #header>
            <div class="flex items-center justify-between">
                <span>基础信息</span>
                <div class="space-x-2">
                    <el-button @click="refreshUser" :loading="status.status.refreshUser" type="primary" size="small">刷新</el-button>
                </div>
            </div>
        </template>

        <el-descriptions border :column="1" v-loading="status.status.refreshUser">
            <el-descriptions-item label="ID" label-class-name="w-64">{{ user.id }}</el-descriptions-item>
            <el-descriptions-item label="登录账号" label-class-name="w-64">{{ user.username }}</el-descriptions-item>
            <el-descriptions-item label="用户名称" label-class-name="w-64">{{ user.name }}</el-descriptions-item>
            <el-descriptions-item label="超级管理员" label-class-name="w-64">
                <el-tag v-if="user.super" type="success" size="small">是</el-tag>
                <el-tag v-else size="small">否</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="角色" label-class-name="w-64">
                <div class="space-x-2">
                    <el-tag v-for="role in user.roles" :key="role.id">{{ role.name }}</el-tag>
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="状态" label-class-name="w-64">
                <el-tag v-if="user.status" type="success" size="small">正常</el-tag>
                <el-tag v-else type="danger" size="small">禁用</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="登录次数" label-class-name="w-64">{{ user.login_count }}</el-descriptions-item>
            <el-descriptions-item label="最后登录时间" label-class-name="w-64">{{ user.last_login_time }}</el-descriptions-item>
            <el-descriptions-item label="最后登录IP" label-class-name="w-64">{{ user.last_login_ip }}</el-descriptions-item>
            <el-descriptions-item label="错误登录次数" label-class-name="w-64">{{ user.login_error_count }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" label-class-name="w-64">{{ user.created_at }}</el-descriptions-item>
            <el-descriptions-item label="更新时间" label-class-name="w-64">{{ user.updated_at }}</el-descriptions-item>
        </el-descriptions>
    </el-card>
</template>

<script setup>
import {computed, ref} from "vue";
import useAuth from "../../../states/auth.js";
import api from "../../../utils/api.js";
import useStatus from "../../../states/status.js";

const auth = useAuth()
const status = useStatus()

const user = ref(auth.user)

const refreshUser = () => api('auth/user').label('refreshUser').get().then(res => user.value = res)
</script>

<style scoped>

</style>
