import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTruckStore = defineStore('truck', () => {
  // ==============================
  // 1. 垃圾車資料狀態 (保留你原本的架構)
  // ==============================
  const truckData = ref<any[]>([])

  const fetchTruckData = async () => {
    // 這裡保留你未來要串接高雄市垃圾車 API 的邏輯
    console.log('準備取得垃圾車資料...')
  }

  // ==============================
  // 2. 使用者地理位置狀態
  // ==============================
  // 儲存使用者的 [緯度, 經度]
  const userLocation = ref<[number, number] | null>(null)

  // 呼叫瀏覽器 API 取得位置
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation.value = [pos.coords.latitude, pos.coords.longitude]
          console.log('成功取得使用者位置:', userLocation.value)
        },
        (err) => {
          console.warn('定位失敗或使用者拒絕授權:', err.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      console.warn('您的瀏覽器不支援地理位置功能')
    }
  }

  // ==============================
  // 3. 確保將所有狀態與函數 return 給外部使用
  // ==============================
  return {
    truckData,
    fetchTruckData,
    userLocation,
    getUserLocation
  }
})
