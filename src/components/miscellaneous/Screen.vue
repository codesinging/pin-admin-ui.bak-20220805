<template>
    <div>
        <div v-if="screen.visible" class="h-screen flex flex-col items-center justify-center">
            <div class="h-16">
                <img src="../../assets/images/logo.svg" alt="PinfanLogo" class="h-16 w-16 animate-pulse">
            </div>
            <div v-if="screen.text" class="mt-2 text-gray-400 text-sm">{{ screen.text }}</div>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script setup>
import useScreen from "../../states/screen";

const screen = useScreen()
</script>

<style scoped>

</style>
