import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ScheduleItem {
  lat?: number;
  lng?: number;
  time?: string;
  location?: string;
  // 若您的 JSON 是大寫或中文欄位，請在這裡對應修改
}

export const useTruckStore = defineStore('truck', () => {
  // 存放垃圾車資料的變數
  const truckData = ref<ScheduleItem[]>([])

  // 取得資料的動作 (Action)
  const fetchTruckData = async () => {
    try {
      const response = await fetch('/Schedule.json')
      if (!response.ok) throw new Error('找不到 Schedule.json')
      truckData.value = await response.json()
    } catch (error) {
      console.error('載入垃圾車資料失敗:', error)
    }
  }

  return { truckData, fetchTruckData }
})
