<template>
  <div class="w-full h-full relative overflow-hidden bg-[#f8f9fa]">
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <div class="absolute bottom-6 right-6 z-10">
      <div class="bg-gray-800 text-white text-[11px] px-4 py-1.5 rounded-full opacity-75 shadow-sm pointer-events-none">
        點擊行政區區塊進入詳細模式
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, ref, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as topojson from 'topojson-client'
import { useTruckStore } from '@/stores/truckStore'
import type { Topology , GeometryObject } from 'topojson-specification'
import type { FeatureCollection } from 'geojson'

const truckStore = useTruckStore()
const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)
const geojsonLayerRef = shallowRef<L.GeoJSON | null>(null)
const truckLayerGroup = shallowRef<L.LayerGroup | null>(null)

// 🔄 定義返回全區視角函數
const resetView = () => {
  if (map.value) {
    // 恢復行政區格線
    if (geojsonLayerRef.value && !map.value.hasLayer(geojsonLayerRef.value)) {
      geojsonLayerRef.value.addTo(map.value)
    }
    map.value.flyTo([22.645, 120.315], 11, { animate: true, duration: 1.0 })
  }
}

// 🌟 重要：將 resetView 暴露給外部元件呼叫
defineExpose({
  resetView
})

// --- 以下地圖初始化與監聽邏輯維持不變 ---
watch(() => truckStore.filteredTruckData, (newData) => {
  if (!map.value || !truckLayerGroup.value) return
  truckLayerGroup.value.clearLayers()
  newData.forEach((stop) => {
    const lat = parseFloat(stop.緯度 as string)
    const lng = parseFloat(stop.經度 as string)
    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#F59E0B", color: "#FFFFFF", weight: 2, opacity: 1, fillOpacity: 0.9
      })
      marker.bindPopup(`<b class="text-orange-600">${stop.停留地點}</b><br>🕒 ${stop.停留時間}`)
      marker.addTo(truckLayerGroup.value!)
    }
  })
}, { immediate: true, deep: true })

//監聽使用者的定位，一但拿到座標，就讓地圖飛過去並標記
watch(() => truckStore.userLocation,(newLocation) =>{
  //把地圖視角移動到使用者的位置
  if(newLocation && map.value){
    map.value.flyTo(newLocation,15,{animate:true,duration:1.0})
  }
  const userMarker = L.circle(newLocation!,{
    radius:  150 ,
    fillColor:"#3B82F6",
    color:"#FFFFFF",
    opacity:1,
    weight:2,
    fillOpacity: 0.5
  })
  userMarker.bindPopup('<b class="text-blue-600"> 您的位置</b>').openPopup()
  userMarker.addTo(map.value!)
})

onMounted(async () => {
  await nextTick()
  if (!mapContainer.value) return
  map.value = L.map(mapContainer.value, { zoomControl: false }).setView([22.645, 120.315], 11)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map.value)
  truckLayerGroup.value = L.layerGroup().addTo(map.value)
  truckStore.fetchTruckData()
  truckStore.getUserLocation()

  try {
    // 🌟 1. 確保這行存在！這是定義 response 的地方
    const response = await fetch('https://taiwan.md/assets/geo/taiwan-towns-64000.topo.json')
    if (!response.ok) throw new Error('網路請求失敗')

    // 2. 轉換為 Topology 型別
    const rawData = (await response.json()) as unknown as Topology

    // 3. 取得 TopoJSON 內的第一個物件 Key
    const firstKey = Object.keys(rawData.objects)[0]

    // 🌟 解決 index type 'undefined' 的錯誤
    if (!firstKey) {
      throw new Error('TopoJSON 格式錯誤')
    }

    const geometryObj = rawData.objects[firstKey] as GeometryObject

    // 4. 轉換為 GeoJSON
    const geojsonData = topojson.feature(
      rawData,
      geometryObj
    ) as unknown as FeatureCollection

    // 5. 渲染地圖圖層
    geojsonLayerRef.value = L.geoJSON(geojsonData, {
      style: {
        color: '#0ea5e9',
        weight: 1,
        fillColor: 'transparent',
        fillOpacity: 0
      },
      onEachFeature: (feature, layer: L.Layer) => {
        interface KaohsiungProps {
          name?: string;
          TOWNNAME?: string;
        }

        const props = feature.properties as KaohsiungProps
        const districtName = props?.name || props?.TOWNNAME

        if (districtName) {
          layer.bindTooltip(districtName, {
            permanent: true,
            direction: 'center',
            className: 'bg-transparent text-gray-400 border-none shadow-none text-[10px] font-bold opacity-70 pointer-events-none'
          })
        }

        layer.on({
          mouseover: (e: L.LeafletMouseEvent) => {
            const targetPath = e.target as L.Path
            targetPath.setStyle({ weight: 6, color: '#2894FF' })
            targetPath.bringToFront()
          },
          mouseout: (e: L.LeafletMouseEvent) => {
            if (geojsonLayerRef.value) {
              geojsonLayerRef.value.resetStyle(e.target as L.Layer)
            }
          },
          click: (e: L.LeafletMouseEvent) => {
            if (map.value) {
              const targetPolygon = e.target as L.Polygon
              map.value.flyTo(targetPolygon.getBounds().getCenter(), 16, { animate: true, duration: 1.0 })
              if (geojsonLayerRef.value) {
                map.value.removeLayer(geojsonLayerRef.value)
              }
            }
          }
        })
      }
    }).addTo(map.value)
  } catch (error) {
    console.error('地圖初始化失敗:', error)
  }
})

onUnmounted(() => { if (map.value) map.value.remove() })
</script>
