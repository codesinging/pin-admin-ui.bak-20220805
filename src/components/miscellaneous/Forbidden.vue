<template>
    <div class="flex items-center justify-center mt-40">
        <el-result icon="error" title="403 禁止访问" :sub-title="subTitle">
            <template #extra>
                <el-button type="primary" @click="layout.closePage()">关闭</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const subTitle = computed(() => `该账号没有访问当前页面(${route.path})的权限`)
</script>

<style scoped>

</style>
