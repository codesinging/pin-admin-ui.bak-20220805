<template>
    <div class="h-full mt-40 flex items-center justify-center">
        <el-result icon="error" title="403 禁止访问" sub-title="无访问权限">
            <template #extra>
                <el-button @click="router.back">返回</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<style scoped>

</style>
