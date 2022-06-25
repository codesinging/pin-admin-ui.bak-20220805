<template>
    <div class="brand flex items-center h-14 flex-shrink-0 bg-gray-700 text-white duration-500">
        <div class="brand-logo flex items-center justify-center">
            <img src="../../assets/images/logo.svg" alt="PinfanLogo" class="w-6 h-6">
        </div>
        <div class="brand-name flex items-center text-sm overflow-hidden whitespace-nowrap duration-500">{{ appConfig.name }}</div>
    </div>
</template>

<script setup>
import {appConfig, layoutConfig} from "../../config";
import useLayout from "../../states/layout";
import {computed} from "vue";

const layout = useLayout()

const logoWidth = computed(() => layoutConfig.sidebarCollapseWidth + 'px')

const brandWidth = computed(() => (layout.collapsed ? layoutConfig.sidebarCollapseWidth : layoutConfig.sidebarWidth) + 'px')
const nameWidth = computed(() => (layout.collapsed ? 0 : (layoutConfig.sidebarWidth - layoutConfig.sidebarCollapseWidth)) + 'px')

</script>

<style scoped>
.brand {
    transition-property: width;
    width: v-bind(brandWidth) !important;
}

.brand-logo {
    width: v-bind(logoWidth);
}

.brand-name {
    transition-property: width;
    width: v-bind(nameWidth) !important;
}
</style>
