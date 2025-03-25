from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware  
from routers import health_records, meal_plans, meals, recipes ,users

from database import Base, engine
from routers import auth_routes
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


# データベースの作成（初回のみ）
Base.metadata.create_all(bind=engine)

# FastAPI アプリの作成
app = FastAPI()


# CORS の設定を適用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドの URL
    allow_credentials=True,
    allow_methods=["*"],  # すべての HTTP メソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)


# ルーターの登録
app.include_router(health_records.router)
app.include_router(meal_plans.router)  #  Meal Plans
app.include_router(meals.router)       #  Meals
app.include_router(recipes.router)     #  Recipes
app.include_router(users.router)

# 認証が必要なエンドポイントを登録
app.include_router(auth_routes.router)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello")
def say_hello():
    return {"message": "こんにちは、FastAPI!"}
