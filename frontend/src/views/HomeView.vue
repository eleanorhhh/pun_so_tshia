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
  display: flex; /* 使用彈性佈局讓列表與地圖並排 */
  gap: 20px;
  padding: 20px;
  width: 100%;
  height: 90vh; /* 設定足夠的視窗高度 */
  box-sizing: border-box;
}

.sidebar {
  width: 300px;
  flex-shrink: 0; /* 鎖定寬度，不被地圖擠壓 */
}

.map-area {
  flex-grow: 1; /* 強制地圖區域佔滿右側所有剩餘空間[cite: 3] */
  min-width: 0; /* 避免 flex 項目溢出[cite: 3] */
  height: 100%;
}
</style>
