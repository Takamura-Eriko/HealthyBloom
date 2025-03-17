import os
from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
from database import Base
from dotenv import load_dotenv

# Alembic の設定オブジェクト
config = context.config

# .env を読み込む
load_dotenv()

# .env の DATABASE_URL を取得
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL が設定されていません！.env ファイルを確認してください。")

# sqlalchemy.url を Alembic の設定に追加
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# ログの設定
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# `Base.metadata` を `target_metadata` に設定（マイグレーションの対象となるモデルを指定）
target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
