import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from logging_config import logger

# .env ファイルの読み込み
load_dotenv()

# パス設定（このファイルが backend/main.py にある場合）
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import Base, engine
from routers import (
    health_records,
    meal_plans,
    meals,
    recipes,
    users,
    auth,
    health_analysis
)

# データベーステーブルの作成（初回のみ）
Base.metadata.create_all(bind=engine)

# FastAPI アプリの作成
app = FastAPI()

logger.info("アプリ起動: FastAPI initialized")

# CORS の設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録（順不同でOKだが整理すると見やすい）
app.include_router(health_records.router)
app.include_router(meal_plans.router)
app.include_router(meals.router)
app.include_router(recipes.router)
app.include_router(users.router)
app.include_router(health_analysis.router)
app.include_router(auth.router)  # 認証系（保護エンドポイント含む）

# シンプルなテスト用エンドポイント
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello")
def say_hello():
    return {"message": "こんにちは、FastAPI!"}
