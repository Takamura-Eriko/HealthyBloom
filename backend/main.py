from fastapi import FastAPI
from routers import health_records, meal_plans, meals, recipes  #  ルーターを追加
from database import Base, engine

# データベースの作成（初回のみ）
Base.metadata.create_all(bind=engine)

# FastAPI アプリの作成
app = FastAPI()

#  ルーターの登録（追加）
app.include_router(health_records.router)
app.include_router(meal_plans.router)  #  Meal Plans
app.include_router(meals.router)       #  Meals
app.include_router(recipes.router)     #  Recipes

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello")
def say_hello():
    return {"message": "こんにちは、FastAPI!"}
