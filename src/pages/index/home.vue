<template>
    <el-card>
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <div class="flex items-center">
                    <el-avatar size="large">{{ user.name }}</el-avatar>
                </div>
                <div class="space-y-1">
                    <div class="text-lg">{{ user.name }}</div>
                    <div class="space-x-1">
                        <el-tag v-if="user.super" type="danger" size="small">超级管理员</el-tag>
                        <template v-else>
                            <el-tag v-for="role in user.roles" :key="role.id" size="small">{{ role.name }}</el-tag>
                        </template>
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
import {computed} from "vue";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'

const auth = useAuth()
const user = computed(() => auth.user)

dayjs.locale('zh-cn')

const {timestamp} = useTimestamp({controls: true})
const time = computed(() => dayjs(timestamp.value).format('M月D日 dddd HH:mm:ss'))
</script>

<style scoped>

</style>
