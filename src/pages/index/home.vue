<template>
    <el-card>
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <div class="flex items-center">
                    <el-avatar size="large">{{ user.name }}</el-avatar>
                </div>
                <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                        <div class="text-lg">{{ user.name }}</div>
                        <div class="space-x-1 flex items-center">
                            <el-tag v-if="user.super" type="danger" size="small">超级管理员</el-tag>
                            <template v-else>
                                <el-tag v-for="role in user.roles" :key="role.id" size="small">{{ role.name }}</el-tag>
                            </template>
                        </div>
                    </div>
                    <div class="text-sm text-gray-400 divide-x">
                        <span class="pr-2">上次登录时间：{{ lastLogin.time }}</span>
                        <span class="px-2">上次登录IP：{{ lastLogin.ip }}</span>
                    </div>
                </div>
            </div>
            <div class="text-sm font-mono">当前时间：{{ time }}</div>
        </div>
    </el-card>
</template>

<script setup>
import useAuth from "../../states/auth.js";
import {useTimestamp} from "@vueuse/core";
import {computed, ref} from "vue";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import api from "../../utils/api";

const auth = useAuth()
const user = computed(() => auth.user)

const lastLogin = ref({})

const refreshLastLogin = () => {
    api('auth/last_login').label('refreshLastLogin').get().then(res => lastLogin.value = res)
}

refreshLastLogin()

dayjs.locale('zh-cn')

const {timestamp} = useTimestamp({controls: true})
const time = computed(() => dayjs(timestamp.value).format('YYYY年MM月DD日 dddd HH:mm:ss'))
</script>

<style scoped>

</style>
