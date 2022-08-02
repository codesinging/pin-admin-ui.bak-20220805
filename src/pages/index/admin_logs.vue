<template>
    <model-view resource="admin_logs" hide-add-button hide-edit-button hide-delete-button pageable>
        <template #table-columns>
            <el-table-column label="请求动作">
                <template #default="{row}">
                    {{ row.route.controller_name}} - {{ row.route.action_name }}
                </template>
            </el-table-column>
            <tag-column label="请求方法" prop="method" :types="types"/>
            <el-table-column label="请求路径" prop="path"></el-table-column>
            <el-table-column label="响应状态" align="center">
                <template #default="{row}">
                    <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="响应代码" align="center">
                <template #default="{row}">
                    <el-tag v-if="row.code!==''" :type="codeType(row.code)">{{ row.code }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="IP 地址" align="center">
                <template #default="{row}">
                    <div class="space-x-1">
                        <span>{{row.ip}}</span>
                        <copy-to-clipboard :text="row.ip"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作用户" prop="user.name"></el-table-column>
            <created-at-column label="操作时间"/>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import TagColumn from "../../components/columns/TagColumn.vue";
import CreatedAtColumn from "../../components/columns/CreatedAtColumn.vue";
import CopyToClipboard from "../../components/miscellaneous/CopyToClipboard.vue";

const types = {
    PUT: 'warning',
    POST: 'success',
    DELETE: 'danger',
}

const statusType = status => {
    if (status.startsWith('2')) {
        return 'success'
    } else if (status.startsWith('4')) {
        return 'warning'
    } else if (status.startsWith('5')) {
        return 'danger'
    }
}
const codeType = code => {
    return code === '0' ? 'success' : 'danger'
}
</script>

<style scoped>

</style>
