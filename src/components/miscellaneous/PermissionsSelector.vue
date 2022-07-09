<template>
    <el-tabs v-model="tab" type="card">
        <el-tab-pane label="页面权限" name="page">
            <el-table ref="pageTable" :data="pages" border table-layout="auto" v-loading="loading" @selection-change="onPageSelectionChange">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column label="页面名称" prop="name"></el-table-column>
                <el-table-column label="页面路径" prop="path"></el-table-column>
                <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                <el-table-column label="权限名" prop="permission.name"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="菜单权限" name="menu">
            <el-table ref="menuTable" :data="menus" border table-layout="auto" v-loading="loading" @selection-change="onMenuSelectionChange">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column label="菜单名称">
                    <template #default="{row}">
                        <span v-for="i in row.depth" class="inline-block w-4"></span>
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="页面名称" prop="page.name"></el-table-column>
                <el-table-column label="页面路径" prop="page.path"></el-table-column>
                <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                <el-table-column label="权限名" prop="permission.name"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="路由权限" name="route">
            <el-table ref="routeTable" :data="routes" border table-layout="auto" v-loading="loading" @selection-change="onRouteSelectionChange">
                <el-table-column type="index" align="center"></el-table-column>
                <merged-column label="控制器名-动作名" :props="['controller_name', 'action_name']" merger="-"></merged-column>
                <merged-column label="控制器-动作" :props="['controller', 'action']" merger="@"></merged-column>
                <el-table-column label="权限ID" prop="permission.id" align="center"></el-table-column>
                <el-table-column label="权限名" prop="permission.name"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import {ref, watch, computed, nextTick} from "vue";
import api from "../../utils/api.js";
import {flatten} from "../../utils/tree.js";
import useStatus from "../../states/status.js";
import MergedColumn from "../../components/columns/MergedColumn.vue";

const props = defineProps({
    modelValue: Array,
})

const status = useStatus()

const tab = ref('page')

const pages = ref([])
const menus = ref([])
const routes = ref([])

const selectedPages = ref([])
const selectedMenus = ref([])
const selectedRoutes = ref([])

const pageTable = ref()
const menuTable = ref()
const routeTable = ref()

const refresh = () => {
    Promise.all([
        api('admin_pages').label('pages').success(false).list({public: false}),
        api('admin_menus').label('menus').success(false).list({public: false}),
        api('admin_routes').label('routes').success(false).list({public: false}),
    ]).then(responses => {
        pages.value = responses[0]
        menus.value = flatten(responses[1])
        routes.value = responses[2]

        nextTick(() => initSelection())
    })
}

refresh()

const initSelection = () => {
    pages.value.filter(item => props.modelValue.includes(item.permission.id)).forEach(item => pageTable.value.toggleRowSelection(item, true))
    menus.value.filter(item => props.modelValue.includes(item.permission.id)).forEach(item => menuTable.value.toggleRowSelection(item, true))
    routes.value.filter(item => props.modelValue.includes(item.permission.id)).forEach(item => routeTable.value.toggleRowSelection(item, true))
}

const onPageSelectionChange = selection => selectedPages.value = selection
const onMenuSelectionChange = selection => selectedMenus.value = selection
const onRouteSelectionChange = selection => selectedRoutes.value = selection

const loading = computed(() => status.any('pages', 'menus', 'routes'))

const emits = defineEmits(['update:modelValue'])

const selectedIds = computed(() => []
    .concat(selectedPages.value.map(item => item.permission.id))
    .concat(selectedMenus.value.map(item => item.permission.id))
    .concat(selectedRoutes.value.map(item => item.permission.id))
)

watch(() => selectedIds.value, ids => {
    emits('update:modelValue', ids)
})

</script>

<style scoped>

</style>
