<script setup lang="ts">
import { ref } from 'vue'
import MapViewer from '@/components/MapViewer.vue'

// 🌟 建立一個 ref 來存取 MapViewer 元件實體
const mapRef = ref<InstanceType<typeof MapViewer> | null>(null)

// 🌟 當點擊導覽列「地圖」時執行的函數
const handleMapClick = () => {
  if (mapRef.value) {
    mapRef.value.resetView() // 呼叫子元件的方法
  }
}
</script>

<template>
  <div class="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-50">

    <header class="h-14 px-4 flex items-center justify-between bg-white shadow-sm z-20 shrink-0">
      <div class="flex-1 max-w-xs bg-gray-100 rounded-full px-4 py-2 flex items-center text-gray-500 text-sm">
        <span class="mr-2">🔍</span>
        <span>搜尋地址或站牌...</span>
      </div>
      <div class="ml-3">
        <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">♻️ 回收日</span>
      </div>
    </header>

    <main class="flex-1 relative overflow-hidden">
      <MapViewer ref="mapRef" />
    </main>

    <nav class="h-16 bg-white border-t flex justify-around items-center shrink-0 z-20 pb-safe shadow-lg">

      <button
        @click="handleMapClick"
        class="flex flex-col items-center text-emerald-600 w-16 active:scale-90 transition-transform"
      >
        <span class="text-2xl mb-1">🔄</span>
        <span class="text-[10px] font-bold">地圖</span>
      </button>

      <button class="flex flex-col items-center text-gray-400 w-16">
        <span class="text-2xl mb-1">⭐</span>
        <span class="text-[10px] font-bold">最愛</span>
      </button>

      <button class="flex flex-col items-center text-gray-400 w-16">
        <span class="text-2xl mb-1">📅</span>
        <span class="text-[10px] font-bold">時刻表</span>
      </button>

      <button class="flex flex-col items-center text-gray-400 w-16">
        <span class="text-2xl mb-1">🔔</span>
        <span class="text-[10px] font-bold">提醒</span>
      </button>
    </nav>

  </div>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
