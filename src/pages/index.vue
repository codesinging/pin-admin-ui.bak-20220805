<template>
    <screen>
        <div>index</div>
    </screen>
</template>

<script setup>
import Screen from "../components/miscellaneous/Screen.vue";
import useScreen from "../states/screen";

const screen = useScreen()
screen.show('加载中')

</script>

<style scoped>

</style>
