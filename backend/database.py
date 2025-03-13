from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# データベース接続情報（PostgreSQL）
DATABASE_URL = "postgresql://postgres:yourpassword@localhost:5432/health_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# データベースセッションを取得
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
