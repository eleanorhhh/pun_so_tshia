<template>
  <!-- 使用 Tailwind 設定地圖容器大小與圓角 -->
  <div class="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
    <div id="map" class="w-full h-full z-0"></div>

    <div class="absolute top-4 left-4 z-10 bg-gray-800 text-white px-4 py-2 rounded-md opacity-90 shadow-md">
      目前顯示：高雄市行政區
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 🌟 關鍵修正 1：改用 shallowRef
// 絕對不要用 ref 存地圖！shallowRef 可以避免 Vue 去監聽地圖內部的複雜狀態，解決 99% 的型別與效能問題。
const map = shallowRef<L.Map | null>(null)

onMounted(async () => {
  // 初始化地圖，中心點大約在高雄三民區一帶
  map.value = L.map('map').setView([22.645, 120.315], 12)

  // 🌟 關鍵修正 2：標準的 TypeScript 防呆檢查
  // 用這個取代 map.value! 的驚嘆號寫法。只要過了這行，TS 就會知道 map.value 絕對存在。
  if (!map.value) return

  // 載入深色模式底圖
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
    maxZoom: 19
  }).addTo(map.value)

  try {
    const response = await fetch('/kaohsiung_districts.json')
    const geojsonData = await response.json()

    // 將 GeoJSON 加入地圖
    L.geoJSON(geojsonData, {

      // 🌟 關鍵修正 3：箭頭函式簡化
      // 既然沒用到 feature，直接省略參數，回傳物件即可
      style: () => ({
        color: '#10B981',
        weight: 2,
        fillColor: '#047857',
        fillOpacity: 0.1
      }),

      onEachFeature: (feature, layer) => {
        // 多做一層檢查，確保資料真的有 TOWNNAME 欄位才綁定 Tooltip
        const districtName = feature.properties?.TOWNNAME

        if (districtName) {
          layer.bindTooltip(districtName, {
            permanent: false,
            direction: 'center',
            className: 'bg-transparent text-white border-none shadow-none text-lg font-bold'
          })
        }

        // 🌟 關鍵修正 4：簡化滑鼠事件寫法
        layer.on({
          mouseover: (e) => e.target.setStyle({ fillOpacity: 0.4 }),
          mouseout: (e) => e.target.setStyle({ fillOpacity: 0.1 })
        })
      }
    }).addTo(map.value)

  } catch (error) {
    console.error('無法載入行政區邊界資料:', error)
  }
})
</script>

<style scoped>
/* 隱藏 Leaflet 預設的白色背景，讓深色主題更完美 */
.leaflet-container {
  background: #1a1a1a;
}
</style>
