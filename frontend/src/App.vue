<template>
  <HomeView/>
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue';
</script>

<style>
/* 🌟 把 #app 也加進來，強制撐開整個畫面，覆蓋掉預設的干擾 */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: block !important; /* 殺手鐧：強制取消 Vite 預設的 flex 置中 */
}

</style>
