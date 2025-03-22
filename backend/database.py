import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# .env ファイルを読み込む
load_dotenv()


# データベース接続情報（環境変数から取得）
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL が設定されていません！.env ファイルを確認してください。")

# SQLAlchemy のエンジンを作成

engine = create_engine(DATABASE_URL)

# データベースセッションを作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルの基底クラス
Base = declarative_base()

# データベースセッションを取得
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
