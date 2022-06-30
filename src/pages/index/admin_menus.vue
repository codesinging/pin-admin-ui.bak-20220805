<template>
    <model-view resource="admin_menus" :view-fields="fields" hide-pagination-on-single>
        <template #table-columns>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="图标" align="center">
                <template #default="scope">
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column label="页面ID" prop="page.id" align="center"></el-table-column>
            <el-table-column label="页面名称" prop="page.name"></el-table-column>
            <el-table-column label="页面路径" prop="page.path"></el-table-column>
            <sort-column/>
            <el-table-column label="展开" align="center">
                <template #default="scope">
                    <switch-updater v-if="scope.row.children.length>0" :scope="scope" prop="opened"/>
                </template>
            </el-table-column>
            <switch-column label="公开" prop="public"/>
            <status-column/>
        </template>

        <template #form-items="{data, list}">
            <el-form-item label="上级菜单" prop="name">
                <el-select v-model="data.parent_id" clearable filterable>
                    <el-option v-for="item in list.filter(menu=>menu.parent_id===null)" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name" :rules="rules.name">
                <el-input v-model="data.name"></el-input>
            </el-form-item>

            <el-form-item label="图标" prop="icon">
                <icon-select v-model="data.icon"></icon-select>
            </el-form-item>

            <el-form-item label="页面" prop="page_id">
                <el-select v-model="data.page_id" clearable>
                    <el-option v-for="page in pages" :key="page.id" :value="page.id" :label="page.name">
                        <div class="flex items-center justify-between">
                            <span>{{ page.name }}</span>
                            <span class="text-xs text-gray-400 ml-8">{{ page.path }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="公开" prop="public">
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
import StatusColumn from "../../components/columns/StatusColumn.vue";
import SwitchColumn from "../../components/columns/SwitchColumn.vue";
import SwitchUpdater from "../../components/updaters/SwitchUpdater.vue";
import IconSelect from "../../components/form/IconSelect.vue";
import {reactive, ref} from "vue";
import api from "../../utils/api";
import SortColumn from "../../components/columns/SortColumn.vue";

const rules = {
    name: [{required: true, message: '名称不能为空'}],
}

const fields = reactive({
    id: 'ID',
    page_id: '页面ID',
    name: '菜单名称',
    icon: '菜单图标',
    sort: '排列序号',
    public: '是否公开菜单',
    default: '是否默认菜单',
    opened: '是否默认展开',
    status: '状态',
    parent_id: '父菜单ID',
    created_at: '创建时间',
    updated_at: '更新时间',
    page: '对应页面',
})

const pages = ref([])

const refreshPages = () => {
    api('admin_pages').label('refreshPages').list().then(res=>{
        pages.value = res
    })
}

refreshPages()
</script>

<style scoped>

</style>
