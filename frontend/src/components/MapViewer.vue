<template>
  <div class="map-container">
    <div id="tw-map" style="height: 600px; width: 100%; border-radius: 8px;"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as topojson from 'topojson-client';
import { useTruckStore } from '@/stores/truckStore'; // 引入 Store

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl, iconUrl, shadowUrl
});

// 啟用 Store
const truckStore = useTruckStore();

onMounted(() => {
  const map = L.map('tw-map', {
    center: [22.6273, 120.3014], zoom: 11, minZoom: 7,
    maxBounds: L.latLngBounds(L.latLng(21.0, 119.0), L.latLng(26.0, 122.5)),
    maxBoundsViscosity: 1.0
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('https://cdn.jsdelivr.net/npm/taiwan-atlas/towns-10t.json')
    .then(res => res.json())
    .then(topoData => {
      const geoJsonData = topojson.feature(topoData, topoData.objects.towns);
      L.geoJSON(geoJsonData, {
        filter: (feature) => feature.properties.COUNTYNAME === '高雄市',
        style: { color: '#3388ff', weight: 2, fillColor: '#3388ff', fillOpacity: 0.15 },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<b>高雄市 ${feature.properties.TOWNNAME || '未知區域'}</b>`);
        }
      }).addTo(map);
    });

  // 監聽 Store 裡面的 truckData，一有資料就畫上大頭針
  watch(() => truckStore.truckData, (newData) => {
    newData.forEach(stop => {
      // ⚠️ 一樣請對應您 Interface 裡面定義的真實屬性
      if (stop.lat && stop.lng) {
        const marker = L.marker([stop.lat, stop.lng]).addTo(map);
        marker.bindPopup(`<b>🚚 停靠點</b><br>🕒 ${stop.time}<br>📍 ${stop.location}`);
      }
    });
  }, { immediate: true, deep: true });
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
