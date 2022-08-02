<template>
    <div class="flex items-center justify-center h-screen">
        <el-card class="w-96">
            <template #header>
                <div class="space-x-2">
                    <span>管理员登录</span>
                    <loading-icon v-if="status.status.refreshConfig"/>
                </div>
            </template>
            <el-form :model="data" ref="form" @keyup.enter="submit" :disabled="status.status.submit||status.status.redirect||status.status.refreshConfig">
                <el-form-item prop="username" :rules="rules.username">
                    <el-input v-model="data.username" placeholder="请输入登录账号">
                        <template #prepend>
                            <div class="w-12">登录账号</div>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password" :rules="rules.password">
                    <el-input v-model="data.password" placeholder="请输入登录密码" show-password>
                        <template #prepend>
                            <div class="w-12">登录密码</div>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item v-if="captchaEnabled" prop="captcha" :rules="rules.captcha">
                    <el-input v-model="data.captcha" placeholder="请输入验证码" class="captcha-input">
                        <template #prepend>
                            <div class="w-12">验证码</div>
                        </template>
                        <template #append>
                            <div class="flex items-center justify-center overflow-hidden p-0.5">
                                <div v-if="status.status.refreshCaptcha" class="flex items-center justify-center px-4">
                                    <loading-icon/>
                                </div>

                                <el-image v-else :src="captcha.img" @click="refreshCaptcha" class="h-7 cursor-pointer text-center">
                                    <template #placeholder>
                                        <loading-icon/>
                                    </template>
                                </el-image>
                            </div>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="mt-8">
                    <el-button type="primary" @click="submit" class="w-full" :loading="status.status.submit||status.status.redirect">登录</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import api from "../utils/api";
import {warning} from "../utils/message";
import useStatus from "../states/status";
import {useRouter} from "vue-router";
import {appConfig} from "../config";
import useAuth from "../states/auth.js";
import LoadingIcon from "../components/icons/LoadingIcon.vue";

const router = useRouter()
const status = useStatus()
const auth = useAuth()

const data = reactive({
    username: import.meta.env.VITE_ADMIN_USERNAME,
    password: import.meta.env.VITE_ADMIN_PASSWORD,
    captcha: '',
    key: '',
})

const rules = {
    username: {required: true, message: '请输入登录账号'},
    password: {required: true, message: '请输入登录密码'},
    captcha: {required: true, message: '请输入验证码'},
}

const form = ref()

const captchaEnabled = ref(false)

const captcha = ref({})

const refreshConfig = () => api('auth/config')
    .label('refreshConfig')
    .message(false)
    .get()
    .then(res => {
        captchaEnabled.value = res.captchaEnabled
        if (captchaEnabled.value) {
            refreshCaptcha()
        }
    })

const refreshCaptcha = () => api('captcha/api')
    .config({baseURL: import.meta.env.VITE_API_HOST})
    .label('refreshCaptcha')
    .message(false)
    .origin()
    .get()
    .then(res => {
        captcha.value = res
        data.key = res.key
    })

refreshConfig()

const submit = () => {
    form.value.validate(valid => {
        if (valid) {
            api('auth/login').label('submit').catch().put(data).then(res => {
                auth.set(res.token, res.admin)

                status.set('redirect')

                router.push(appConfig.home).then(() => status.unset('redirect'))
            }).finally(() => {
                refreshCaptcha()
                data.captcha = ''
            })
        } else {
            warning('表单验证未通过，请重新填写')
        }
    })
}
</script>

<style>
.captcha-input .el-input-group__append {
    padding: 0 !important;
}
</style>
