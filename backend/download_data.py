import urllib.request
import json

# 這是確定會通，但被限制的基礎網址
base_url = "https://data.kcg.gov.tw/Json/Get/a6ba725a-488c-4d40-b5a2-c2fe65d3e134"

# 準備測試幾種政府 API 最常用的破解參數
test_urls = [
    ("原始網址", base_url),
    ("測試 limit", f"{base_url}?limit=50000"),
    ("測試 size", f"{base_url}?size=50000"),
    ("測試 top", f"{base_url}?$top=50000")
]

print("🕵️‍♂️ 開始探測 API 的限制破解方法...\n")

for name, url in test_urls:
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        
        # 抓取大寫 Data 陣列的長度
        records = data.get("Data", [])
        print(f"[{name}] 抓到了 {len(records)} 筆資料")
    except Exception as e:
        print(f"[{name}] 發生錯誤: {e}")