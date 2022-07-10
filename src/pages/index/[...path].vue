<template>
    <div class="h-full mt-40 flex items-center justify-center">
        <el-result icon="error" title="404 页面不存在" :sub-title="subTitle">
            <template #extra>
                <el-button type="primary" @click="layout.closePage()">关闭</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import {computed} from "vue";
import useLayout from "../../states/layout.js";

const layout = useLayout()

const subTitle = computed(() => `当前页面(${layout.activeTab.path})不存在`)
</script>

<style scoped>

</style>
