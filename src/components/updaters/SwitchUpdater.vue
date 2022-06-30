<template>
    <el-switch
        v-model="scope.row[prop]"
        @change="change(scope)"
        :loading="cellStatus(scope)"
        size="small"
        inline-prompt
        :active-icon="Check"
        :inactive-icon="Close"
    ></el-switch>
</template>

<script setup>
import {inject} from "vue";
import {Check, Close} from "@icon-park/vue-next";

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
