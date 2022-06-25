<template>
    <div class="flex-1 overflow-hidden p-4">
        <router-view v-slot="{Component}">
            <keep-alive>
                <el-scrollbar>
                    <component :is="Component"></component>
                </el-scrollbar>
            </keep-alive>
        </router-view>
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import useLayout from "../../states/layout";
import {computed} from "vue";
import {authConfig} from "../../config";

const route = useRoute()
const router = useRouter()
const layout = useLayout()

const permitted = computed(() => layout.hasPage(route.path))

if (permitted){
    router.push(authConfig.forbidden)
}
</script>

<style scoped>

</style>
