<template>
  <div class="layout-container">
    <header class="navbar">
      <h1>高雄垃圾車即時地圖</h1>
    </header>

    <main class="map-area">
      <MapViewer />
    </main>
  </div>
</template>

<script setup lang="ts">
import MapViewer from '@/components/MapViewer.vue';
</script>

<style scoped>
/* 1. 最外層容器：設定為垂直彈性排版，撐滿整個視窗 */
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 100vh 代表螢幕的 100% 高度 */
  width: 100vw;
  overflow: hidden; /* 隱藏多餘的網頁捲軸 */
}

/* 2. 上方 Navbar：固定高度 */
.navbar {
  height: 64px; /* 固定高度 */
  background-color: #1f2937; /* 深灰色背景 */
  color: white;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 1.25rem;
  font-weight: bold;
  flex-shrink: 0; /* 確保 Navbar 絕對不會被地圖擠壓變形 */
}

/* 3. 下方地圖區塊：自動填滿剩餘空間 */
.map-area {
  flex-grow: 1; /* 🌟 關鍵魔法：自動把 Navbar 剩下的空間全部吃掉 */
  position: relative;
  width: 100%;
}
</style>
