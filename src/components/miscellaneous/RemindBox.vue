<template>
    <el-popover :width="300">
        <template #reference>
            <div class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                <el-badge :value="total" :hidden="total < 1" class="flex items-center justify-center">
                    <span class="flex items-center"><remind :stroke-width="3" :size="18"/></span>
                </el-badge>
            </div>
        </template>
        <el-tabs v-model="tab" stretch>
            <el-tab-pane name="notice">
                <el-empty description="暂无通知" :image-size="120"></el-empty>
                <template #label>
                    <div class="space-x-1 flex items-center justify-center">
                        <span>通知</span>
                        <el-tag v-if="notices.length" type="danger" effect="dark" round size="small">{{ notices.length }}</el-tag>
                    </div>
                </template>
            </el-tab-pane>
            <el-tab-pane name="message">
                <el-empty description="暂无消息" :image-size="120"></el-empty>
                <template #label>
                    <div class="space-x-1 flex items-center justify-center">
                        <span>消息</span>
                        <el-tag v-if="messages.length" type="danger" effect="dark" round size="small">{{ messages.length }}</el-tag>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
    </el-popover>
</template>

<script setup>
import {Remind} from "@icon-park/vue-next";
import {computed, ref} from "vue";

const tab = ref('notice')

const notices = ref([])

const messages = ref([])

const total = computed(() => notices.value.length + messages.value.length)

const initTab = () => {
    if (notices.value.length === 0 && messages.value.length > 0) {
        tab.value = 'message'
    }
}

initTab()
</script>

<style scoped>

</style>
