<template>
    <el-card header="修改信息">
        <form-view action="auth/update" @after-submit="afterSubmit" :default-data="defaultData">
            <template #default="{data}">
                <el-form-item label="名称" prop="name" :rules="[{required: true, message: '不能为空'}]">
                    <el-input v-model="data.name" placeholder="请输入名称"></el-input>
                </el-form-item>
            </template>
        </form-view>
    </el-card>
</template>

<script setup>
import {computed} from "vue";
import FormView from "../../../components/views/FormView.vue";
import useAuth from "../../../states/auth.js";

const auth = useAuth()

const afterSubmit = (data) => {
    auth.update(data)
}

const defaultData = computed(() => auth.user)
</script>

<style scoped>

</style>
