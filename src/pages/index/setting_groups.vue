<template>
    <model-view resource="setting_groups" :form-default="formDefault">
        <template #table-columns>
            <name-column/>
            <el-table-column label="分组描述" prop="description"></el-table-column>
            <el-table-column label="分组键名" prop="key"></el-table-column>
            <sort-column/>
        </template>

        <template #form-items="{data}">
            <el-form-item label="分组名称" prop="name" :rules="[{required: true, message: '名称不能为空'}]">
                <el-input v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="分组键名" prop="key" :rules="[{required: true, message: '键名不能为空'}]">
                <el-input v-model="data.key"></el-input>
            </el-form-item>
            <el-form-item label="分组描述" prop="description">
                <el-input v-model="data.description"></el-input>
            </el-form-item>
            <el-form-item label="排列序号" prop="sort">
                <el-input-number v-model.number="data.sort"></el-input-number>
            </el-form-item>
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import NameColumn from "../../components/columns/NameColumn.vue";
import SortColumn from "../../components/columns/SortColumn.vue";

const formDefault = {
    sort: 0,
}
</script>

<style scoped>

</style>
