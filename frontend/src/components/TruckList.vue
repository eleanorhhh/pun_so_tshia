<template>
  <div class="truck-list">
    <h3>🗑️ 垃圾車時刻表</h3>
    <div class="list-container">
      <div class="list-item" v-for="(stop, index) in truckStore.truckData" :key="index">
        <div class="time">{{ stop.time }}</div>
        <div class="location">{{ stop.location }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTruckStore } from '@/stores/truckStore';

// 直接連接 Store 拿資料
const truckStore = useTruckStore();
</script>

<style scoped>
.truck-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 600px;
  overflow-y: auto;
}
.list-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.time { font-weight: bold; color: #e67e22; }
.location { font-size: 14px; color: #555; }
</style>
