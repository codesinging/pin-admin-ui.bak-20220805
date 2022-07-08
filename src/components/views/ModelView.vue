<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <el-button v-if="!hideAddButton" @click="onAdd" type="primary" :icon="Plus">新增</el-button>
            <el-button v-if="!hideRefreshButton" @click="onRefresh" :icon="Refresh" :loading="status.status.refresh">刷新</el-button>
            <slot name="header-actions"></slot>
        </div>

        <div v-if="hasSearch" class="flex items-center space-x-2">
            <el-form :model="searchData" inline>
                <slot name="search-form-items" :data="searchData"></slot>

                <el-form-item>
                    <el-button @click="search" type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <el-table :data="lister.data" v-loading="status.status.refresh" border table-layout="auto" flexible default-expand-all row-key="id" :indent="15" class="mt-2">
        <el-table-column v-if="!hideIdColumn" type="id" label="ID" prop="id" align="center"></el-table-column>

        <slot name="table-columns"></slot>

        <el-table-column v-if="!hideActionColumn" label="操作" align="center">
            <template #default="scope">
                <div class="space-x-1">
                    <el-button v-if="!hideEditButton" @click="onEdit(scope.row)" link size="small" type="primary">编辑</el-button>
                    <el-button v-if="!hideViewButton" @click="onView(scope.row)" link size="small" type="primary">查看</el-button>
                    <el-button v-if="!hideDeleteButton" @click="onDelete(scope)" :loading="cellStatus(scope,'delete')" link size="small" type="danger">删除</el-button>
                    <slot name="action-buttons" :row="scope.row"></slot>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <div class="mt-2 px-2 h-11 bg-gray-50 flex items-center justify-between">
        <el-pagination
            v-if="props.pageable"
            background
            small
            :hide-on-single-page="hidePaginationOnSingle"
            layout="total, prev, pager, next"
            v-model:current-page="lister.page"
            :page-size="lister.size"
            :total="lister.total"
        ></el-pagination>
        <el-pagination
            v-else
            background
            small
            :hide-on-single-page="hidePaginationOnSingle"
            layout="total"
            :total="lister.total"
        ></el-pagination>
    </div>

    <extended-dialog v-model="editDialog.states.visible" :title="editDialog.states.title" :icon="editDialog.icon" :close-on-click-modal="false" :loading="editDialog.loading()">
        <el-form ref="editForm" :model="editData" label-position="top" v-bind="formAttributes" @keyup.enter="onSubmit" :disabled="status.status.submit">
            <slot name="form-items" :data="editData" :list="lister.data" :isUpdate="isUpdate"></slot>
        </el-form>

        <template #actions>
            <el-button @click="editDialog.close()">取消</el-button>
            <el-button @click="onSubmit" type="primary" :loading="status.status.submit">保存</el-button>
        </template>
    </extended-dialog>

    <extended-dialog v-model="viewDialog.states.visible" :title="viewDialog.states.title" :icon="viewDialog.icon" :loading="viewDialog.loading()">
        <extended-descriptions :data="viewData" :fields="viewFields" :depth="viewDepth"></extended-descriptions>

        <template #actions>
            <el-button @click="viewDialog.close()">关闭</el-button>
        </template>
    </extended-dialog>
</template>

<script setup>
import {Plus, Refresh, Edit, DocDetail} from "@icon-park/vue-next";
import useStatus from "../../states/status";
import {useRoute} from "vue-router";
import api from "../../utils/api";
import {computed, provide, reactive, ref, useSlots, watch} from "vue";
import {warning} from "../../utils/message";
import {confirm} from "../../utils/messageBox";
import ExtendedDialog from "../extensions/ExtendedDialog.vue";
import ExtendedDescriptions from "../extensions/ExtendedDescriptions.vue";
import useDialog from "../../utils/dialog";

const status = useStatus()
const route = useRoute()

const props = defineProps({
    // 接口资源名
    resource: {
        type: String,
        required: true,
    },

    // 是否隐藏新增按钮
    hideAddButton: Boolean,

    // 是否隐藏刷新按钮
    hideRefreshButton: Boolean,

    // 是否分页
    pageable: Boolean,

    // 分页大小
    pageSize: {
        type: Number,
        default: 10,
    },

    // 表格属性
    tableAttributes: Object,

    // 是否隐藏ID列
    hideIdColumn: Boolean,

    // 是否隐藏操作列
    hideActionColumn: Boolean,

    // 操作列宽度
    actionColumnWidth: {
        type: [String, Number],
        default: 150,
    },

    // 是否隐藏表格行内查看按钮
    hideViewButton: Boolean,

    // 是否隐藏表格行内编辑按钮
    hideEditButton: Boolean,

    // 是否隐藏表格行内删除按钮
    hideDeleteButton: Boolean,

    // 只有一页时是否隐藏页码
    hidePaginationOnSingle: Boolean,

    // 编辑表单默认数据
    formDefault: Object,

    // 编辑表单属性
    formAttributes: Object,

    // 查看详情的字段
    viewFields: {
        type: Object,
        default: () => ({}),
    },

    // 查看详情的展示层级
    viewDepth: {
        type: [String, Number],
        default: 2,
    }
})

// 当前视图的资源接口
const apis = () => api(props.resource)

// 列表数据
const lister = ref(props.pageable ? {page: 1, size: props.pageSize, data: [], total: 0} : {page: 0, data: [], total: 0})

// 数组转换成列表
const toLister = lister => Array.isArray(lister) ? {page: 0, data: lister, total: lister.length} : lister

// 表格单元格请求标记
const cellLabel = (scope, action = null) => [scope.column.id, scope.$index, action].join('_')

// 表格单元格请求状态
const cellStatus = (scope, action = null) => status.status[cellLabel(scope, action)]

// 刷新列表数据
const refresh = (params = {}) => {
    Object.assign(params, route.query)

    if (props.pageable) {
        params.page = lister.value.page
        params.size = lister.value.size
    }

    return apis().label('refresh').list(params).then(res => lister.value = toLister(res))
}

// 点击刷新按钮
const onRefresh = () => refresh()

// 更新
const update = (scope, action = null) => apis().label(cellLabel(scope, action)).catch().update(scope.row).then(() => refresh()).catch(() => refresh())

// 编辑对话框参数
const editDialog = useDialog('编辑', Edit)

// 编辑表单数据
const editData = ref({})

// 是否编辑状态
const isUpdate = computed(() => !!editData.value['id'])

// 编辑表单元素
const editForm = ref()

// 提交表单数据
const onSubmit = () => {
    editForm.value.validate(valid => {
        if (valid) {
            const data = editData.value

            const request = isUpdate.value
                ? apis().label('submit').update(data)
                : apis().label('submit').store(data)

            request.then(res => {
                editDialog.close()
                refresh()
            })
        } else {
            warning('表单验证未通过，请重新填写')
        }
    })
}

// 点击新增按钮
const onAdd = () => {
    editData.value = Object.assign({}, props.formDefault)
    editDialog.open('新增')
}

// 点击修改按钮
const onEdit = row => {
    editData.value = Object.assign({}, row)

    apis().label(editDialog.label).show(row.id).then(res => editData.value = res)

    editDialog.open('编辑')
}

// 所有插槽
const slots = useSlots()

// 是否存在搜索插槽
const hasSearch = computed(() => slots['search-form-items'] !== undefined)

// 搜索关键词
const searchData = ref({})

// 是否存在搜索数据
const hasSearchData = computed(() => Object.values(searchData.value).filter(item => item !== '').length > 0)

// 发送搜索请求
const search = () => {
    if (hasSearchData.value) {
        refresh(searchData.value)
    } else {
        warning('请输入搜索条件')
    }
}

// 查看对话框参数
const viewDialog = useDialog('查看详情', DocDetail)

// 查看对话框详情数据
const viewData = ref({})

// 点击查看按钮
const onView = row => {
    viewData.value = Object.assign({}, row)
    apis().label(viewDialog.label).show(row.id).then(res => viewData.value = res)
    viewDialog.open()
}

// 删除
const destroy = (scope, action = null) => apis().label(cellLabel(scope, action)).destroy(scope.row.id).then(res => {
    lister.value.data.splice(scope.$index, 1)
    refresh()
})

// 点击删除按钮
const onDelete = scope => {
    confirm('删除后无法恢复！确定要删除吗？', '删除确认')
        .then(() => destroy(scope, 'delete'))
        .catch(() => void 0)
}

// 初始化表单数据
refresh()

// 监听页面变化
if (props.pageable) {
    watch(() => lister.value.page, () => refresh())
}

// 供给给子组件
provide('refresh', refresh)
provide('update', update)
provide('destroy', destroy)
provide('cellLabel', cellLabel)
provide('cellStatus', cellStatus)

// 暴露给父组件
defineExpose({
    refresh,
    update,
    destroy,
    cellLabel,
    cellStatus,
    editData,
    viewData,
})
</script>

<style scoped>

</style>
