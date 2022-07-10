<template>
    <el-card>
        <div class="flex items-center justify-between">
            <div class="space-x-2 flex items-center">
                <span class="text-sm text-gray-500">欢迎你</span>
                <span class="text-blue-500">{{ auth.user.name }}</span>
                <div v-if="auth.user.super">(<span class="text-sm text-purple-800">超级管理员</span>)</div>
                <div v-else-if="auth.user.roles?.length" class="space-x-1">[<span v-for="role in auth.user.roles" :key="role.id" class="text-sm text-blue-600">{{ role.name }}</span>]</div>
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

dayjs.locale('zh-cn')

const {timestamp} = useTimestamp({controls: true})
const time = computed(() => dayjs(timestamp.value).format('M月D日 dddd HH:mm:ss'))
</script>

<style scoped>

</style>
