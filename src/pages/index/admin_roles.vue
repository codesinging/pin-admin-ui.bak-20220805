<template>
    <model-view resource="admin_roles">
        <template #table-columns>
            <name-column/>
            <el-table-column label="描述" prop="description"></el-table-column>
            <sort-column/>
            <status-column/>
            <el-table-column label="权限设置" align="center">
                <template #default="{row}">
                    <el-button link type="primary" size="small">页面</el-button>
                    <el-button link type="primary" size="small">菜单</el-button>
                    <el-button link type="primary" size="small">动作</el-button>
                </template>
            </el-table-column>
        </template>

        <template #form-items="{data}">
            <el-form-item label="名称" prop="name" :rules="[{required: true, message: '名称不能为空'}]">
                <el-input v-model="data.name" autofocus></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="data.description"></el-input>
            </el-form-item>
            <el-form-item label="排列序号" prop="sort">
                <el-input-number v-model="data.sort"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="data.status"></el-switch>
            </el-form-item>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import NameColumn from "../../components/columns/NameColumn.vue";
import SortColumn from "../../components/columns/SortColumn.vue";
import StatusColumn from "../../components/columns/StatusColumn.vue";
</script>

<style scoped>

</style>
