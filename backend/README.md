# pun-so-tshia-backend

FastAPI 後端。建議在虛擬環境內安裝：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS / Linux
pip install -e .
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

健康檢查：`GET http://127.0.0.1:8000/api/health`

複製 `.env.example` 為 `.env` 後可依需求覆寫設定。
