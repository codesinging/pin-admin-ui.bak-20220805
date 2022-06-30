<template>
    <template v-if="level < depth">
        <el-descriptions v-if="typeof data === 'object'" border :column="1">
            <el-descriptions-item v-for="(value,key) in data" :key="key" label-class-name="w-64">
                <template #label>
                    {{ key }} <span class="text-xs text-gray-400">{{ fields[key] }}</span>
                </template>
                <template v-if="Array.isArray(value)">
                    <div class="space-y-2">
                        <template v-for="(item,index) in value" :key="index">
                            <template v-if="typeof item === 'string' || typeof item === 'number'">{{ item }}</template>
                            <extended-descriptions v-else :data="item" :level="level+1"></extended-descriptions>
                        </template>
                    </div>
                </template>
                <extended-descriptions v-else-if="typeof value === 'object'" :data="value" :level="level+1"></extended-descriptions>
                <template v-else>{{ value }}</template>
            </el-descriptions-item>
        </el-descriptions>
        <extended-descriptions v-else v-for="(item,index) in data" :key="index" :data="item" :level="level+1"></extended-descriptions>
    </template>
    <template v-else>
        <div class="text-gray-400">...</div>
    </template>
</template>

<script setup>
defineProps({
    level: {
        type: Number,
        default: 0,
    },
    depth: {
        type: [Number, String],
        default: 2,
    },
    data: [Object, Array],
    fields: {
        type: Object,
        default: () => ({})
    },
})

</script>

<style scoped>

</style>
