<template>
    <model-view resource="admin_pages" :view-fields="fields">
        <template #table-columns>
            <el-table-column label="页面名称" prop="name"></el-table-column>
            <el-table-column label="页面路径" prop="path"></el-table-column>
            <switch-column label="公共" prop="public"/>
            <status-column/>
        </template>

        <template #form-items="{data}">
            <el-form-item label="页面名称" prop="name" :rules="rules.name">
                <el-input v-model="data.name"></el-input>
            </el-form-item>

            <el-form-item label="页面路径" prop="name">
                <el-input v-model="data.path"></el-input>
            </el-form-item>

            <el-form-item label="是否公共页面" prop="public">
                <el-switch v-model="data.public"></el-switch>
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-switch v-model="data.status"></el-switch>
            </el-form-item>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import {reactive} from "vue";
import StatusColumn from "../../components/columns/StatusColumn.vue";
import SwitchColumn from "../../components/columns/SwitchColumn.vue";

const fields = reactive({
    id: 'ID',
    name: '页面名称',
    path: '页面路径',
    sort: '排列序号',
    public: '是否公开页面',
    status: '页面状态',
    created_at: '创建时间',
    updated_at: '更新时间',
})

const rules = {
    name: [{required: true, message: '页面名称不能为空'}],
    path: [{required: true, message: '页面路径不能为空'}],
}
</script>

<style scoped>

</style>
