<template>
  <HomeView/>
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue';
</script>

<style>
/* 這裡把原本預設的 header, logo 樣式全部刪除！ */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa; /* 給一個淡淡的背景色，讓白色的列表更明顯 */
}
</style>
