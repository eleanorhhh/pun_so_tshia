<template>
  <div class="truck-list w-full flex flex-col h-full">

    <div class="flex items-center mb-4 pb-2 border-b">
      <button v-if="step > 1" @click="goBack" class="mr-3 text-emerald-600 font-bold">
        ⬅ 返回
      </button>
      <h3 class="text-lg font-bold text-gray-800">
        <span v-if="step === 1">請選擇行政區</span>
        <span v-else-if="step === 2">{{ selectedDistrict }} - 請選擇路段</span>
        <span v-else>{{ selectedDistrict }} {{ selectedRoad }} - 站點</span>
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto p-5">

      <div v-if="step === 1" class="grid grid-cols-3 gap-3">
        <button
          v-for="district in uniqueDistricts" :key="district"
          @click="selectDistrict(district)"
          class="py-3 px-2 bg-gray-100 hover:bg-emerald-100 text-gray-700 rounded-xl shadow-sm transition-colors text-sm font-bold"
        >
          {{ district }}
        </button>
      </div>

      <div v-else-if="step === 2" class="flex flex-col gap-2">
        <button
          v-for="road in uniqueRoad" :key="road"
          @click="selectRoad(road)"
          class="py-3 px-4 bg-white border border-gray-200 hover:border-emerald-400 text-left rounded-xl shadow-sm transition-colors text-sm"
        >
          {{ road }}
        </button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div class="list-item bg-white p-3 border rounded-lg shadow-sm" v-for="(stop, index) in finalStop" :key="index">
          <div class="time text-emerald-600 font-bold">{{ stop.停留時間 }}</div>
          <div class="location text-gray-600 text-sm mt-1">{{ stop.停留地點 }}</div>
        </div>

        <div v-if="finalStop.length === 0" class="text-center text-gray-500 py-4 text-sm">
          此路段暫無站點資料
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useTruckStore  } from '@/stores/truckStore';
import { computed , ref , onMounted } from 'vue';

// 直接連接 Store 拿資料
const truckStore = useTruckStore();

onMounted(()=>{
  truckStore.fetchTruckData();
});

//------分層按鈕設定-------

//狀態設定
const step = ref(1)
const selectedDistrict = ref('')
const selectedRoad = ref("")

// 🌟 魔法核心：事先處理資料，幫每一筆站點加上過濾好的「單純路名 (roadName)」
const enrichedData = computed(() => {
  return truckStore.scheduleData.map(stop => {
    const locationStr = stop.停留地點 || ''

    // 正規表達式：從字首開始抓，直到遇到「路」、「街」、「大道」或「巷」為止
    const match = locationStr.match(/^.+?(路|街|大道|巷)/)

    // 如果有抓到路名就用抓到的，沒抓到就歸類為「其他地點」
    const roadName = match ? match[0] : '其他地點'

    return {
      ...stop, // 保留原本的資料(行政區、車次等)
      roadName // 新增我們萃取出來的單純路名
    }
  })
})

//第一層，計算出不重複的行政清單
const uniqueDistricts = computed(()=>{
  // 🌟 改從 enrichedData 裡面拿資料
  const all = enrichedData.value.map(stop => stop.行政區)
  return [...new Set(all)].filter(Boolean)
})

//第二層，取得選定行政區內的路
const uniqueRoad = computed (()=>{
  const stopInDistrict = enrichedData.value.filter(stop => stop.行政區 === selectedDistrict.value)
  // 🌟 改抓我們剛才算出來的 roadName (單純路名)
  const allRoad = stopInDistrict.map(stop => stop.roadName)
  return [...new Set(allRoad)].filter(Boolean)
})

//第三層，取得最終要顯示的站點
const finalStop = computed(()=>{
  return enrichedData.value.filter(stop =>
    stop.行政區 === selectedDistrict.value &&
    stop.roadName === selectedRoad.value // 🌟 條件改為比對 roadName
  )
})

//進入第二層
const selectDistrict = ( District :string) => {
  selectedDistrict.value = District
  step.value = 2
}

//進入第三層
const selectRoad = (road : string ) =>{
  selectedRoad.value = road
  step.value = 3
}

//返回上一層
const goBack = () =>{
  if(step.value > 1)
    step.value--
}
</script>

<style scoped>
/* 記得保留你原本設定好的寬度 100% */
.truck-list {
  background: white;
  width: 100%;
}
</style>
