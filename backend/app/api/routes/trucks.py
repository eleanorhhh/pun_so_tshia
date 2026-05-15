import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
import httpx
# 透過APIRouter 可以把垃圾車相關的api獨立放在一個檔案裡管理
router = APIRouter()

#定義資料夾的絕對路徑
DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent/"data"

def load_json_data(filename: str):
    
    file_path = DATA_DIR / filename
    
    #檢查檔案是否存在
    if not file_path.exists():
        raise HTTPException(status_code=404,detail="資料夾檔案不存在")
    
    #打開檔案並讀取json，會用with open()是因為他在讀取完畢會自動幫你關檔案，避免佔用系統資源
    with open(file_path,"r",encoding="utf-8") as f:
        return json.load(f)
    
#定義提供班表的 API Endpoint
@router.get("/schedule")
def get_truck_schedule():
    """取得垃圾車班表資料"""
    return load_json_data("Schedule.json")

#定義提供動態資訊的api
@router.get("/realtime")
async def get_realtime_data():
    url = "https://data.kcg.gov.tw/Json/Get/aaf4ce4b-4ca8-43de-bfaf-6dc97e89cac0"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            
            # 這裡要檢查狀態碼
            if response.status_code != 200:
                # 如果不是 200，就丟出錯誤
                raise HTTPException(status_code=response.status_code, detail="無法取得即時資料")
                
                #取得原始資料
            raw_data = response.json()
            raw_trucks = raw_data.get("Data", [])

            cleaned_data = []
            for item in raw_trucks:
                location_str = item.get("location", "")
                
                # 🔍 判斷有沒有「區」
                if "區" in location_str:
                    # ✂️ 找到「區」的位置，並往前剪下 3 個字
                    pos = location_str.find("區")
                    district_name = location_str[pos - 2 : pos + 1]
                    
                    # 📦 重新包裝成前端需要的格式與正確的欄位名稱
                    new_item = {
                        "車號": item.get("car"),
                        "行政區": district_name,
                        "經度": item.get("x"),
                        "緯度": item.get("y"),
                        "時間": item.get("time"),
                        "地點": location_str
                    }
                    cleaned_data.append(new_item)

            return {"Data": cleaned_data}
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"伺服器內部錯誤: {str(e)}")