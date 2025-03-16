from sqlalchemy.orm import Session
from models import HealthRecord, MealPlan, Meal, Recipe, User
from schemas import HealthRecordCreate, MealPlanCreate, MealCreate,UserCreate
import uuid

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=str(uuid.uuid4()),  # UUID を文字列として保存
        email=user.email,
        name=user.name,
        password_hash=user.password  # TODO: 実際のアプリではパスワードハッシュ化が必要
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ユーザーをメールアドレスで取得
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# 健診データを保存
def create_health_record(db: Session, record: HealthRecordCreate):
    db_record = HealthRecord(id=str(uuid.uuid4()), **record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# 健診データを取得
def get_health_records(db: Session, user_id: str):
    return db.query(HealthRecord).filter(HealthRecord.user_id == user_id).all()

# MealPlan（食事プラン）を作成
def create_meal_plan(db: Session, meal_plan: MealPlanCreate):
    db_meal_plan = MealPlan(
        id=uuid.uuid4(),  # UUIDを自動生成
        user_id=meal_plan.user_id,
        start_date=meal_plan.start_date,
        end_date=meal_plan.end_date
    )
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan

# Meal（食事）を登録
def create_meal(db: Session, meal: MealCreate):
    db_meal = Meal(
        id=uuid.uuid4(),  # UUIDを自動生成
        user_id=meal.user_id,
        date=meal.date,
        meal_type=meal.meal_type,
        recipe_id=meal.recipe_id
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal

# MealPlan を取得
def get_meal_plan(db: Session, meal_plan_id: str):
    return db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()

# Meal（食事記録）を取得
def get_meal(db: Session, meal_id: str):
    return db.query(Meal).filter(Meal.id == meal_id).first()

# すべてのレシピを取得
def get_recipes(db: Session):
    return db.query(Recipe).all()
