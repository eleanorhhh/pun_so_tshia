from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health,trucks
from app.core.config import settings

app = FastAPI(title="垃圾車追蹤 API")

# 註冊 API routers
app.include_router(health.router, prefix="/api/health", tags=["health"])

#將trucks路由掛載到主程式上
app.include_router(trucks.router, prefix="/api/trucks", tags=["trucks"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
