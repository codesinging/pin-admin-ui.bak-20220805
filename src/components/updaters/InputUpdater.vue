<template>
    <el-input
        v-model="scope.row[prop]"
        @change="change(scope)"
        v-loading="cellStatus(scope)"
        size="small"
    ></el-input>
</template>

<script setup>
import {inject} from "vue";

defineProps({
    scope: Object,
    prop: String,
})

const update = inject('update')
const cellStatus = inject('cellStatus')

const change = scope => update(scope)
</script>

<style scoped>

</style>
