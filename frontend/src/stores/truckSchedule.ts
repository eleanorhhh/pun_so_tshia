import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TruckStop {
  行政區: string
  村里: string
  停留地點: string
  停留時間: string
  回收日?: string
}

export const useTruckStore = defineStore('truck', () => {
  const truckData = ref<TruckStop[]>([])




  //拿取schedule.json的資料，並存到truckData裡面
  const fetchTruckData = async () => {
    try {
      // 請確認 Schedule.json 是放在 frontend/public/Schedule.json
      const response = await fetch('/Schedule.json')
      const json = await response.json()
      if (json.success && json.data) {
        truckData.value = json.data as TruckStop[]
        console.log('✅ 成功載入資料，總數：', truckData.value.length)
      }
    } catch (error) {
      console.error('❌ 無法取得 Schedule.json，請檢查檔案是否在 public 資料夾下', error)
    }
  }
  return {
    truckData,
    fetchTruckData,
    }
})
