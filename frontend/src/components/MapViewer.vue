<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // 這是必須的，否則地圖會破版
import { useTruckStore } from '@/stores/truckStore'
import { storeToRefs } from 'pinia'

// DOM 元素參考
const mapContainer = ref<HTMLElement | null>(null)

// 存放地圖與圖層的變數（不需要響應式，用一般變數即可）
let map: L.Map | null = null
const markersLayer = L.layerGroup()

// 引入 Pinia Store
const truckStore = useTruckStore()
const { trucks, isLoading } = storeToRefs(truckStore)

onMounted(() => {
  // 1. 初始化地圖
  if (mapContainer.value) {
    // 預設中心點設在高雄車站附近，縮放級別設為 13
    map = L.map(mapContainer.value).setView([22.6273, 120.3014], 13)

    // 載入 OpenStreetMap 底圖
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // 將「標記專用圖層」加入地圖中
    markersLayer.addTo(map)
  }

  // 2. 觸發 API 請求，獲取垃圾車資料
  truckStore.fetchTrucks()
})

// 3. 監聽 trucks 資料的變化
watch(trucks, (newTrucks) => {
  if (!map) return

  // 每次資料更新時，先清空圖層上舊的垃圾車標記
  markersLayer.clearLayers()

  // 跑迴圈，把新的垃圾車資料一個個畫到地圖上
  newTrucks.forEach(truck => {
    // ⚠️ 注意：這裡的欄位名稱 (X, Y 或 lat, lng) 需依照政府 API 實際回傳的格式調整
    const lat = Number(truck.Y) // 緯度通常是 Y
    const lng = Number(truck.X) // 經度通常是 X

    if (!isNaN(lat) && !isNaN(lng)) {
      // 建立標記點
      const marker = L.marker([lat, lng])

      // 綁定點擊時跳出的資訊視窗 (Popup)
      marker.bindPopup(`
        <strong>車牌號碼：</strong>${truck.car}<br>
        <strong>目前位置：</strong>${truck.location}<br>
        <strong>更新時間：</strong>${truck.time}
      `)

      // 將標記點加入我們的專用圖層
      marker.addTo(markersLayer)
    }
  })
}, { deep: true }) // 使用 deep: true 確保陣列內部的物件變化也能被監聽到

onUnmounted(() => {
  // 元件銷毀時清除地圖實體，釋放記憶體
  if (map) map.remove()
})
</script>

<template>
  <div class="map-wrapper">
    <!-- 讀取中的提示 -->
    <div v-if="isLoading" class="loading-overlay">
      正在取得最新的垃圾車動態...
    </div>

    <!-- 地圖容器（必須給定高度） -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
}

.map-container {
  height: 600px; /* 依照你的設計稿調整高度 */
  width: 100%;
  border-radius: 8px; /* 加點圓角看起來比較現代 */
  z-index: 1;
}

.loading-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 999; /* 確保提示在浮在地圖上方 */
  font-weight: bold;
}
</style>
