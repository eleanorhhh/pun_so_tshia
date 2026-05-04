// frontend/src/stores/truckStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TruckData {
  _id?: number | string;
  car: string;
  time: string;
  location: string;
  X: string | number;
  Y: string | number;
}

export const useTruckStore = defineStore('truck', () => {
  const trucks = ref<TruckData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTrucks = async () => {
    isLoading.value = true
    try {
      const response = await fetch('/api/v1/trucks')
      if (!response.ok) throw new Error('無法取得資料')

      const result = await response.json()
      trucks.value = result.data.result.records as TruckData[]

    } catch (err: unknown) { // 👈 1. 這裡把 any 改成 unknown
      // 2. 判斷這個 err 到底是不是一個標準的 Error 物件
      if (err instanceof Error) {
        error.value = err.message
      } else {
        // 如果 API 丟回來的不是標準錯誤（例如丟回一個字串），就給個預設訊息
        error.value = '發生未知錯誤'
      }
    } finally {
      isLoading.value = false
    }
  }

  return { trucks, isLoading, error, fetchTrucks }
})
