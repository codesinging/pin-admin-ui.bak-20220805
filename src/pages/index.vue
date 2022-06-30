<template>
    <screen>
        <div class="h-screen flex">
            <div class="flex flex-col flex-shrink-0 flex-grow-0 h-full bg-gray-700 overflow-hidden">
                <layout-brand/>
                <layout-menu/>
                <layout-collapse/>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
                <layout-header/>
                <layout-tab/>
                <layout-content/>
            </div>
        </div>
    </screen>
</template>

<script setup>
import Screen from "../components/miscellaneous/Screen.vue";
import useScreen from "../states/screen";
import useLayout from "../states/layout";
import {useRoute, useRouter} from "vue-router";
import LayoutBrand from "../components/layout/LayoutBrand.vue";
import LayoutHeader from "../components/layout/LayoutHeader.vue";
import LayoutMenu from "../components/layout/LayoutMenu.vue";
import LayoutCollapse from "../components/layout/LayoutCollapse.vue";
import LayoutTab from "../components/layout/LayoutTab.vue";
import LayoutContent from "../components/layout/LayoutContent.vue";

const screen = useScreen()
const layout = useLayout()
const route = useRoute()
const router = useRouter()

layout.load().then(() => {
    layout.init(route)
}).finally(() => {
    screen.hide(500)
})

screen.show('加载中')
</script>

<style scoped>

</style>
