from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey
from sqlalchemy.dialects.postgresql import JSON 
from database import Base
import uuid
from datetime import date

# ユーザーモデル
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(String, default=date.today().isoformat())

# 健康診断データモデル
class HealthRecord(Base):
    __tablename__ = "health_records"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    age = Column(Integer, nullable=False)  # 年齢
    gender = Column(String, nullable=False)  # 性別
    height = Column(Float)
    weight = Column(Float)
    bmi = Column(Float)
    blood_pressure_systolic = Column(Integer)
    blood_pressure_diastolic = Column(Integer)
    blood_sugar = Column(Float)
    hba1c = Column(Float)
    cholesterol_total = Column(Float)
    cholesterol_hdl = Column(Float)
    cholesterol_ldl = Column(Float)
    triglycerides = Column(Float)
    liver_got = Column(Float)
    liver_gpt = Column(Float)
    liver_r_gpt = Column(Float)
    anomalies = Column(JSON)
    created_at = Column(String,  default=lambda: date.today().isoformat())
