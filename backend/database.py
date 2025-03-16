import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# .env ファイルを読み込む
load_dotenv()

# `postgresql://` を `postgresql+psycopg2://` に変換
DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgresql+psycopg2://")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL が設定されていません！.env ファイルを確認してください。")

# SQLAlchemy のエンジンを作成
engine = create_engine(DATABASE_URL, echo=True)  # SQLログを出力

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
