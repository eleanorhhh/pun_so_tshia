# pun_so_tshia（高雄垃圾車即時系統）

Monorepo：**Vue 3 + Vite** 前端與 **FastAPI** 後端，詳見 [docs/architecture.md](docs/architecture.md)。

## 需求

- Node.js **^20.19.0** 或 **>=22.12.0**（與前端 `package.json` 的 `engines` 一致）
- Python **3.11+** 與 `pip`

## 安裝

```bash
# 根目錄：安裝 concurrently、cross-env，並安裝 frontend 依賴
npm run install:all

# 後端（建議使用虛擬環境）
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -e .
```

## 本機開發

在儲存庫**根目錄**：

```bash
npm run dev
```

會同時啟動：

- 前端：Vite（預設 <http://localhost:5173>）
- 後端：Uvicorn（<http://127.0.0.1:8000>），路由前綴 `/api`

亦可分開執行：

```bash
npm run dev:frontend
npm run dev:backend
```

後端健康檢查：<http://127.0.0.1:8000/api/health>

前端首頁可點「檢查 /api/health」；開發模式下請求會經 Vite 代理至後端。

## 目錄

| 路徑 | 說明 |
|------|------|
| `frontend/` | Vue 3 應用 |
| `backend/` | FastAPI 應用 |
| `docs/` | 架構與設計文件 |
| `scripts/` | 輔助腳本（環境檢查等） |

## 環境變數

後端可複製 `backend/.env.example` 為 `backend/.env` 後調整（勿將 `.env` 提交版本庫）。
