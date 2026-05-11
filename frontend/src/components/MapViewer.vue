<template>
  <div class="w-full rounded-none overflow-hidden transition-colors duration-300"
       :style="{
         position: 'absolute',
         top: 0, bottom: 0, left: 0, right: 0,
         backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'
       }">

    <div ref="mapContainer" style="width: 100%; height: 100%; z-index: 0;"></div>

    

    <button
      @click="toggleTheme"
      class="absolute top-4 right-4 z-10 px-4 py-2 rounded-md font-bold shadow-md cursor-pointer transition-colors duration-200"
      :style="{
        backgroundColor: isDarkMode ? '#ffffff' : '#1f2937',
        color: isDarkMode ? '#1f2937' : '#ffffff'
      }"
    >
      切換為 {{ isDarkMode ? '淺色' : '深色' }}模式
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, ref, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 引入 TopoJSON 解析套件
import * as topojson from 'topojson-client'
import type { Topology, GeometryObject } from 'topojson-specification'
import type { FeatureCollection } from 'geojson'

// 引入我們寫好的 Pinia Store
import { useTruckStore } from '@/stores/truckStore'

// 初始化 Store
const truckStore = useTruckStore()

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

// 追蹤主題狀態與地圖圖層
const isDarkMode = ref(true)
const tileLayerRef = shallowRef<L.TileLayer | null>(null)
const geojsonLayerRef = shallowRef<L.GeoJSON | null>(null)

// 行政區的配色邏輯
const getGeoJsonStyle = () => {
  return {
    color: isDarkMode.value ? '#10B981' : '#0ea5e9',      // 邊界顏色
    weight: 1,
    fillColor: isDarkMode.value ? '#047857' : '#0284c7',  // 填滿顏色
    fillOpacity: 0.1
  }
}

// 主題切換函數
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value

  // 瞬間替換底圖
  if (tileLayerRef.value) {
    const newUrl = isDarkMode.value
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    tileLayerRef.value.setUrl(newUrl)
  }

  // 瞬間替換行政區框線顏色
  if (geojsonLayerRef.value) {
    geojsonLayerRef.value.setStyle(getGeoJsonStyle)
  }
}

// ==========================================
// 🌟 核心新功能：監聽 Store 裡面的使用者位置變化
// ==========================================
watch(() => truckStore.userLocation, (newLoc) => {
  if (newLoc && map.value) {
    // 1. 平滑飛到使用者位置，縮放級別設為 13 (看得見附近區域的大小)
    map.value.flyTo(newLoc, 13, {
      animate: true,
      duration: 1.5 // 飛行時間 1.5 秒
    })

    // 2. 畫一個稍微透明的大範圍圓圈代表約略位置 (半徑 800 公尺)
    L.circle(newLoc, {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.2,
      radius: 800
    }).addTo(map.value)
      .bindPopup('<b class="text-emerald-600 text-lg">您的約略位置</b>')
  }
})

onMounted(async () => {
  await nextTick()
  if (!mapContainer.value) return

  // 1. 初始化地圖，預設中心點設在高雄市
  map.value = L.map(mapContainer.value).setView([22.645, 120.315], 11)

  // 2. 載入預設(深色)底圖
  tileLayerRef.value = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM contributors',
    maxZoom: 19
  }).addTo(map.value)

  // 🌟 3. 呼叫 Store 觸發定位請求
  // 這樣一載入網頁就會問使用者權限，拿到位置後就會觸發上面的 watch 飛過去
  truckStore.getUserLocation()

  // 4. 載入高雄市行政區 TopoJSON
  try {
    const response = await fetch('https://taiwan.md/assets/geo/taiwan-towns-64000.topo.json')
    if (!response.ok) throw new Error('網路請求失敗')
    const kaohsiungTopo = await response.json()

    const geojsonData = topojson.feature(
      kaohsiungTopo as unknown as Topology,
      Object.values(kaohsiungTopo.objects)[0] as unknown as GeometryObject
    ) as unknown as FeatureCollection

    geojsonLayerRef.value = L.geoJSON(geojsonData, {
      style: getGeoJsonStyle,
      onEachFeature: (feature, layer) => {
        const districtName = feature.properties?.name || feature.properties?.TOWNNAME
        if (districtName) {
          layer.bindTooltip(districtName, {
            permanent: false,
            direction: 'center',
            className: 'bg-transparent text-white border-none shadow-none text-xl font-black drop-shadow-md'
          })
        }

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ fillOpacity: 0.5, weight: 3 })
            e.target.bringToFront()
          },
          mouseout: (e) => {
            if (geojsonLayerRef.value) {
              geojsonLayerRef.value.resetStyle(e.target)
            }
          }
        })
      }
    }).addTo(map.value)

  } catch (error) {
    console.error('無法渲染地圖資料:', error)
  }

  // 避免 Leaflet 容器尺寸計算錯誤出現灰塊
  setTimeout(() => {
    map.value?.invalidateSize()
  }, 200)
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>
