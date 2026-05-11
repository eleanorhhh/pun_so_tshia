import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TruckStop {
  行政區: string
  村里: string
  停留地點: string
  停留時間: string
  經度: string | number
  緯度: string | number
  回收日?: string
}

export const useTruckStore = defineStore('truck', () => {
  const truckData = ref<TruckStop[]>([])
  const userLocation = ref<[number, number] | null>(null)

  // 🌟 測試設定 1：設定為 true 會顯示所有站點，不論時間
  const debugMode = ref(true)

  // 🌟 測試設定 2：模擬現在是晚上 7 點半
  const now = ref(new Date('2026-05-12T19:30:00'))

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

  const filteredTruckData = computed(() => {
    // 🌟 如果開啟除錯模式，直接回傳全部資料，方便測試地圖畫點
    if (debugMode.value) {
      return truckData.value
    }

    const currentHour = now.value.getHours()
    const currentMinute = now.value.getMinutes()
    const currentTotalMinutes = currentHour * 60 + currentMinute

    return truckData.value.filter(stop => {
      if (!stop.停留時間 || !stop.停留時間.includes(':')) return false

      const timeParts = stop.停留時間.split(':')
      if (timeParts.length < 2) return false

      const h = Number(timeParts[0])
      const m = Number(timeParts[1])
      const stopTotalMinutes = h * 60 + m
      const diff = Math.abs(currentTotalMinutes - stopTotalMinutes)

      return diff <= 10
    })
  })

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation.value = [pos.coords.latitude, pos.coords.longitude]
        },
        (err) => console.warn('定位失敗:', err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    }
  }

  return {
    truckData,
    filteredTruckData,
    fetchTruckData,
    userLocation,
    getUserLocation,
    debugMode // 匯出這個，你可以在 Vue DevTools 手動切換
  }
})
