from pydantic import BaseModel, field_validator
from datetime import datetime, date
from typing import Dict, Optional
from uuid import UUID

# ユーザー作成スキーマ
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str  # パスワードは作成時のみ必要

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True  # SQLAlchemy モデルとの互換性を保つ

# 健診データのリクエストスキーマ
class HealthRecordCreate(BaseModel):
    user_id: UUID
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
    id: UUID
    user_id: UUID 

    # UUID を str に変換する validator
    @field_validator('id', 'user_id', mode='before')
    def convert_uuid_to_str(cls, value):
        if isinstance(value, UUID):
            return str(value)
        return value

    class Config:
        orm_mode = True  # ORM モードを有効にする

# レシピスキーマ
class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    cooking_time: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True  # ORM 互換

# 食事記録スキーマ
class MealBase(BaseModel):
    user_id: UUID
    date: date
    meal_type: str  # breakfast, lunch, dinner
    recipe_id: Optional[UUID] = None

class MealCreate(MealBase):
    pass

class MealResponse(MealBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True

# 食事プランスキーマ
class MealPlanBase(BaseModel):
    user_id: UUID
    start_date: date
    end_date: date

class MealPlanCreate(MealPlanBase):
    pass

class MealPlanResponse(MealPlanBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True

# 食事プランとレシピの中間テーブル
class MealPlanRecipeBase(BaseModel):
    meal_plan_id: UUID
    recipe_id: UUID

class MealPlanRecipeCreate(MealPlanRecipeBase):
    pass

class MealPlanRecipeResponse(MealPlanRecipeBase):
    pass

# 栄養情報タグスキーマ
class MealNutritionTagBase(BaseModel):
    name: str

class MealNutritionTagCreate(MealNutritionTagBase):
    pass

class MealNutritionTagResponse(MealNutritionTagBase):
    id: UUID

    class Config:
        orm_mode = True
