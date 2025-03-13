from fastapi import FastAPI
from routers import health_records
from database import Base, engine

# データベースの作成（初回のみ）
Base.metadata.create_all(bind=engine)


# FastAPI アプリの作成
app = FastAPI()

# ルーターの登録
app.include_router(health_records.router)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello")
def say_hello():
    return {"message": "こんにちは、FastAPI!"}
