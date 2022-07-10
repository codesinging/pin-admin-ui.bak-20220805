<template>
    <div class="flex-1 overflow-hidden p-4">
        <router-view v-slot="{Component}">
            <el-scrollbar>
                <keep-alive v-if="permitted">
                    <component :is="Component"></component>
                </keep-alive>
                <forbidden v-else/>
            </el-scrollbar>
        </router-view>
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import useLayout from "../../states/layout";
import {computed} from "vue";
import Forbidden from "../../components/miscellaneous/Forbidden.vue";

const route = useRoute()
const router = useRouter()
const layout = useLayout()

const permitted = computed(() => layout.hasPage(route.path))
</script>

<style scoped>

</style>
