<template>
  <div class="map-container">
    <!-- 地圖的容器，必須給定高度才能顯示 -->
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // 務必引入 CSS，否則地圖會破版

onMounted(async () => {
  // 1. 初始化地圖，中心點設定在台灣 [緯度, 經度]，縮放級別設為 7
  const map = L.map('map').setView([23.6978, 120.9605], 7)

  // 2. 載入 OpenStreetMap 的圖磚層 (TileLayer)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // 3. 讀取 public 資料夾下的 schedule.json
  try {
    const response = await fetch('/schedule.json')
    if (!response.ok) throw new Error('Network response was not ok')

    const scheduleData = await response.json()

    // 4. 根據 JSON 資料在地圖上加上標記 (Markers)
    scheduleData.forEach((item: { title: string, lat: number, lng: number }) => {
      if (item.lat && item.lng) {
        L.marker([item.lat, item.lng])
          .addTo(map)
          .bindPopup(`<b>${item.title}</b>`) // 點擊標記時跳出的提示框
      }
    })
  } catch (error) {
    console.error('讀取 schedule.json 失敗:', error)
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  padding: 20px;
}

#map {
  width: 100%;
  height: 600px; /* 地圖容器必須有明確的高度 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
