// src/composables/useGeolocation.ts
import { ref } from 'vue'

export function useGeolocation() {
  // 儲存經緯度的變數
  const coords = ref<[number, number] | null>(null)
  const errorMsg = ref<string | null>(null)

  const fetchLocation = () => {
    if (!('geolocation' in navigator)) {
      errorMsg.value = '您的瀏覽器不支援地理位置功能'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = [position.coords.latitude, position.coords.longitude]
      },
      (error) => {
        errorMsg.value = error.message
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }

  return { coords, errorMsg, fetchLocation }
}
