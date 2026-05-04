<template>
  <main class="map-container">
    <h2>我的台灣地圖</h2>
    <!-- 呼叫地圖元件 -->
    <MapViewer />
  </main>
</template>

<script setup lang="ts">
// 引入剛剛寫好的 MapViewer.vue
import MapViewer from '@/components/MapViewer.vue';
</script>

<style scoped>

</style>
