from pydantic import BaseModel, validator
from datetime import date
from typing import Dict, Optional
from uuid import UUID

# 健診データのリクエストスキーマ
class HealthRecordCreate(BaseModel):
    user_id: str
    date: date
    age: int  # 年齢
    gender: str  # 性別
    height: float
    weight: float
    bmi: float
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    blood_sugar: float
    hba1c: float
    cholesterol_total: float
    cholesterol_hdl: float
    cholesterol_ldl: float
    triglycerides: float
    liver_got: float
    liver_gpt: float
    liver_r_gpt: float
    anomalies: Optional[Dict[str, str]] = None

# 健診データのレスポンススキーマ
class HealthRecordResponse(HealthRecordCreate):
    id: str
    user_id: str 

        # UUID を str に変換するための validator
    @validator('id', 'user_id', pre=True)
    def convert_uuid_to_str(cls, value):
        if isinstance(value, UUID):
            return str(value)  # UUID を文字列に変換
        return value

    class Config:
        orm_mode = True  # ORM モードを有効にして SQLAlchemy モデルからの変換を有効にする
