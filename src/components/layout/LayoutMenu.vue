<template>
    <div class="flex-1 text-white overflow-hidden">
        <el-scrollbar>
            <el-menu
                v-if="layout.menus.length>0"
                @select="layout.selectMenu"
                :collapse="layout.collapsed"
                :default-active="layout.activeMenu?.id"
                :default-openeds="layout.openedMenuIds"
                background-color="#374151"
                text-color="#fff"
            >
                <layout-menu-item v-for="(menu,index) in layout.menuTree" :key="index" :menu-item="menu"></layout-menu-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import useLayout from "../../states/layout";
import LayoutMenuItem from "./LayoutMenuItem.vue";

const layout = useLayout()
</script>

<style scoped>

</style>
