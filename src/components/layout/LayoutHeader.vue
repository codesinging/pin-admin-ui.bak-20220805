<template>
    <div class="flex justify-between h-14 border-b px-4">
        <div class="flex items-center space-x-2">
            <el-breadcrumb>
                <el-breadcrumb-item v-for="(item,index) in layout.activePaths" :key="index">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div v-if="user" class="flex items-center space-x-2 h-full">
            <div class="pr-3 flex items-center">
                <remind-box/>
            </div>
            <el-dropdown>
                <div class="flex items-center space-x-1 cursor-pointer">
                    <el-avatar :size="32" :src="user.avatar" :icon="User"></el-avatar>
                    <div class="text-sm">{{ user.name }}</div>
                    <i class="bi-chevron-down mt-1"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="openPage('/user/home')"><i class="bi-house mr-1"></i>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="openPage('/user/logins')"><i class="bi-door-open mr-1"></i>登录日志</el-dropdown-item>
                        <el-dropdown-item @click="openPage('/user/logs')"><i class="bi-file-earmark-text mr-1"></i>操作日志</el-dropdown-item>
                        <el-dropdown-item @click="openPage('/user/permissions')"><i class="bi-shield-check mr-1"></i>权限列表</el-dropdown-item>
                        <el-dropdown-item @click="openPage('/user/profile')" divided><i class="bi-postcard mr-1"></i>修改信息</el-dropdown-item>
                        <el-dropdown-item @click="openPage('/user/password')"><i class="bi-key mr-1"></i>修改密码</el-dropdown-item>
                        <el-dropdown-item @click="logout" divided><i class="bi-power mr-1"></i>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-tooltip placement="bottom" :content="isFullscreen?'退出全屏':'全屏显示'">
                <div @click="toggleFullscreen" class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                    <component :is="isFullscreen ? OffScreen : FullScreen" :stroke-width="3" :size="18"/>
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup>
import useLayout from "../../states/layout";
import {useFullscreen} from "@vueuse/core";
import {computed} from "vue";
import {FullScreen, OffScreen, Remind, User} from "@icon-park/vue-next";
import {useRouter} from "vue-router";
import useScreen from "../../states/screen";
import {authConfig} from "../../config";
import useAuth from "../../states/auth.js";
import api from "../../utils/api.js";
import RemindBox from "../miscellaneous/RemindBox.vue";

const layout = useLayout()
const router = useRouter()
const screen = useScreen()
const auth = useAuth()

const {isFullscreen, toggle: toggleFullscreen} = useFullscreen()

const user = computed(() => auth.user)

const openPage = (page) => layout.openPage(page)

const logout = () => {
    screen.show('注销登录')

    api('auth/logout').label('logout').catch(true).put().finally(() => {
        auth.clear()
        layout.clear()
        setTimeout(() => router.push(authConfig.login).then(() => screen.hide()), 1000)
    })
}
</script>

<style scoped>

</style>
