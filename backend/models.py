from sqlalchemy import Column, String, Integer, Float, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSON, JSONB, UUID
from sqlalchemy.sql import func
from database import Base
import uuid

# ユーザーモデル
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

# 健康診断データモデル
class HealthRecord(Base):
    __tablename__ = "health_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
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
    created_at = Column(DateTime, default=func.now())

# レシピモデル
class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    cooking_time = Column(Integer)
    difficulty = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime, default=func.now())

# 食事記録モデル
class Meal(Base):
    __tablename__ = "meals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    meal_type = Column(String, nullable=False)
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"))
    created_at = Column(DateTime, default=func.now())

# 食事プランモデル（GPT対応）
class MealPlan(Base):
    __tablename__ = "meal_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    plan_json = Column(JSONB, nullable=True)  # GPT生成の1週間メニュー保存用
    created_at = Column(DateTime, default=func.now())

# 食事プランとレシピの中間テーブル
class MealPlanRecipe(Base):
    __tablename__ = "meal_plan_recipes"
    meal_plan_id = Column(UUID(as_uuid=True), ForeignKey("meal_plans.id"), primary_key=True)
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"), primary_key=True)

# 栄養情報タグモデル
class MealNutritionTag(Base):
    __tablename__ = "meal_nutrition_tags"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
