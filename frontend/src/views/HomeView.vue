<template>
  <main class="dashboard">
    <!-- 左邊放列表 -->
    <div class="sidebar">
      <TruckList />
    </div>

    <!-- 右邊放地圖 -->
    <div class="map-area">
      <MapViewer />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import MapViewer from '@/components/MapViewer.vue';
import TruckList from '@/components/TruckList.vue';
import { useTruckStore } from '@/stores/truckStore';

const truckStore = useTruckStore();

onMounted(() => {
  // 元件掛載時，呼叫 API 抓取資料
  // 資料一回來，TruckList 跟 MapViewer 就會自動同步更新！
  truckStore.fetchTruckData();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  gap: 20px;
  padding: 20px;
  width: 100vw; /* 確保整個儀表板有撐滿視窗 */
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  width: 300px;
  flex-shrink: 0; /* 確保側邊欄不會被地圖擠壓 */
}

.map-area {
  flex-grow: 1;
  width: 100%; /* 🌟 關鍵：強制地圖區域佔滿剩餘的空間 */
  min-width: 0; /* 🌟 雙重保險：防止 Flex 子元素計算錯誤而縮水 */
}
</style>
