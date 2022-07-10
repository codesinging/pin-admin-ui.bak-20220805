<template>
    <div v-if="layout.tabs.length > 0" class="flex px-4 mt-4">
        <div class="flex-1 layout-tab">
            <el-tabs v-model="activeTabId" type="card" @tab-remove="onTabRemove">
                <el-tab-pane v-for="(tab,index) in layout.tabs" :key="index" :label="tab.name" :name="tab.id" :closable="!layout.isDefaultTab(tab.id)"></el-tab-pane>
            </el-tabs>
        </div>
        <div v-if="layout.tabs.length>2" class="w-10 flex-shrink-0 border-b flex items-center justify-end">
            <div class="flex items-center justify-center w-8 h-8 bg-gray-50 rounded cursor-pointer">
                <el-dropdown placement="bottom-end" @command="onTabCommand">
                    <i class="bi-chevron-down"></i>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="left">
                                <i class="bi-arrow-left"></i>
                                关闭左侧
                            </el-dropdown-item>
                            <el-dropdown-item command="right">
                                <i class="bi-arrow-right"></i>
                                关闭右侧
                            </el-dropdown-item>
                            <el-dropdown-item command="other">
                                <i class="bi-x-lg"></i>
                                关闭其它
                            </el-dropdown-item>
                            <el-dropdown-item command="all">
                                <i class="bi bi-x-circle"></i>
                                关闭全部
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import useLayout from "../../states/layout";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";

const layout = useLayout()
const router = useRouter()

const activeTabId = ref(layout.activeTab?.id)

const removeTab = tab => {
    layout.removeTab(tab)
}

const onTabRemove = id => {
    removeTab(layout.findTabById(id))
}

const onTabCommand = command => {
    let activeIndex = layout.tabs.findIndex(tab => tab.id === activeTabId.value)

    let removingTabs = []

    switch (command) {
        case 'left':
            removingTabs = layout.tabs.filter((item, index) => index < activeIndex)
            break
        case 'right':
            removingTabs = layout.tabs.filter((item, index) => index > activeIndex)
            break
        case 'other':
            removingTabs = layout.tabs.filter((item, index) => index !== activeIndex)
            break
        case 'all':
            removingTabs = layout.tabs.filter(item => item.id !== layout.homeTab.id)
            break
    }

    removingTabs.forEach(tab => removeTab(tab))
}

const navigate = page => {
    router.push(page.path)
}

watch(activeTabId, id => {
    const page = layout.findTabById(id)
    const menu = layout.findMenuByPageId(id)
    layout.activateMenu(menu)
    layout.activateTab(page)
    navigate(page)
})

watch(() => layout.activeTab, page => activeTabId.value = page.id)
</script>

<style scoped>

</style>
