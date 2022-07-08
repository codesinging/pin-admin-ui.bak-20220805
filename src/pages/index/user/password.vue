<template>
    <el-card header="修改密码">
        <form-view action="auth/password" @after-submit="afterSubmit">
            <template #default="{data}">
                <el-form-item label="原密码" prop="current_password" :rules="[{required: true, message: '不能为空'}]">
                    <el-input v-model="data.current_password" show-password placeholder="请输入当前密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password" :rules="[{required: true, message: '不能为空'}]">
                    <el-input v-model="data.password" show-password placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="password_confirmation" :rules="[{required: true, message: '不能为空'}]">
                    <el-input v-model="data.password_confirmation" show-password placeholder="请输入确认密码"></el-input>
                </el-form-item>
            </template>
        </form-view>
    </el-card>
</template>

<script setup>
import FormView from "../../../components/views/FormView.vue";
import useScreen from "../../../states/screen";
import {useRouter} from "vue-router";
import {authConfig} from "../../../config";
import useAuth from "../../../states/auth.js";
import api from "../../../utils/api.js";

const screen = useScreen()
const router = useRouter()
const auth = useAuth()

const afterSubmit = data => {
    screen.show('重新登录')

    api('auth/logout').label('logout').catch(true).put().finally(() => {
        auth.clear()
        setTimeout(() => router.push(authConfig.login).then(() => screen.hide()), 1000)
    })
}
</script>

<style scoped>

</style>
