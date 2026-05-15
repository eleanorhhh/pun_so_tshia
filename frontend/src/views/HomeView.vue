<script setup lang="ts">
import { ref } from 'vue'
import MapViewer from '@/components/MapViewer.vue'
import TruckList from '@/components/TruckList.vue'

// 🌟 建立一個 ref 來存取 MapViewer 元件實體
const mapRef = ref<InstanceType<typeof MapViewer> | null>(null)

// 🌟 當點擊導覽列「地圖」時執行的函數
const handleMapClick = () => {
  if (mapRef.value) {
    mapRef.value.resetView() // 呼叫子元件的方法
  }
}

const showTruckList = ref(false)
const TruckListClick = () =>{
  showTruckList.value = !showTruckList.value
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
      <Transition name="modal-fade">
        <div v-if="showTruckList" class="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTruckList = false"></div>

          <div class="relative w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">

            <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h2 class="text-xl font-bold text-gray-800">🗑️ 垃圾車時刻表</h2>
              <button @click="showTruckList = false" class="text-gray-400 text-2xl">✕</button>
            </div>

            <div class="flex-1 overflow-y-auto">
              <TruckList />
            </div>

          </div>
        </div>
      </Transition>
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

      <button
        @click="TruckListClick"
        class="flex flex-col items-center text-gray-400 w-16"
      >
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

/*---------動畫--------- */
/*進退場動畫*/
.slide-up-enter-active,
.slide-up-leave-active{
  transition: all 0.4s ease;
}
/*初始結束狀態，透明度是0且內容往下移100% */
.slide-up-enter-from,
.slide-up-leave-to{
  opacity: 0;
}

.slide-up-enter-from.relative,
.slide-up-leave-to.relative{
  transform: scale(0.9);
}
/*---------動畫--------- */
</style>
