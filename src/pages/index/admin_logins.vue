<template>
    <model-view resource="admin_logins" hide-add-button hide-edit-button hide-delete-button pageable>
        <template #table-columns>
            <el-table-column label="登录账号" prop="user.username"></el-table-column>
            <el-table-column label="登录用户名" prop="user.name"></el-table-column>
            <el-table-column label="登录时间" prop="time" align="center"></el-table-column>
            <el-table-column label="登录IP" prop="ip" align="center"></el-table-column>
            <el-table-column label="登录结果" align="center">
                <template #default="{row}">
                    <el-tag v-if="row.result" type="success">成功</el-tag>
                    <el-tag v-else type="danger">失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="响应代码" align="center">
                <template #default="{row}">
                    <el-tag v-if="row.code!==''" :type="codeType(row.code)">{{ row.code }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="响应结果" prop="message"></el-table-column>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";

const codeType = code => {
    return code === 0 ? 'success' : 'danger'
}
</script>

<style scoped>

</style>
