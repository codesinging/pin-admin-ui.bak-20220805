<template>
    <el-tooltip :content="content" :visible="visible" placement="top">
        <div class="inline-block cursor-pointer text-gray-400 hover:text-gray-600" @click="onCopy">
            <slot><copy-icon/></slot>
        </div>
    </el-tooltip>
</template>

<script setup>
import {Copy as CopyIcon} from "@icon-park/vue-next";
import {ref} from "vue";
import {useClipboard} from "@vueuse/core";

const props = defineProps({
    text: String,
})

const content = ref('已复制')
const visible = ref(false)

const {copy} = useClipboard()

const onCopy = () => {
    copy(props.text).then(() => {
        visible.value = true
        setTimeout(() => visible.value = false, 1000)
    })
}
</script>

<style scoped>

</style>
