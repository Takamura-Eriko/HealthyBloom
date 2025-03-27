from sqlalchemy.orm import Session
from models import HealthRecord, MealPlan, Meal, Recipe, User
from schemas import HealthRecordCreate, MealPlanCreate, MealCreate, UserCreate
from uuid import UUID
import uuid


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    db_user = User(
        id=uuid.uuid4(),
        email=user.email,
        name=user.name,
        password_hash=user.password  # 実際のアプリではハッシュ化が必要
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_health_record(db: Session, record: HealthRecordCreate):
    db_record = HealthRecord(id=uuid.uuid4(), **record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_health_records(db: Session, user_id: str):
    return db.query(HealthRecord).filter(HealthRecord.user_id == user_id).all()


def create_meal_plan(db: Session, meal_plan: MealPlanCreate):
    db_meal_plan = MealPlan(
        id=uuid.uuid4(),
        user_id=meal_plan.user_id,
        start_date=meal_plan.start_date,
        end_date=meal_plan.end_date,
        plan_json=meal_plan.plan_json
    )
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan


def delete_meal_plan_in_same_week(db: Session, user_id: UUID, start_date, end_date):
    """
    同一ユーザーで同週のMealPlanがあれば削除（重複登録防止）
    """
    plans = db.query(MealPlan).filter(
        MealPlan.user_id == user_id,
        MealPlan.start_date <= end_date,
        MealPlan.end_date >= start_date
    ).all()

    for plan in plans:
        db.delete(plan)

    db.commit()


def create_meal(db: Session, meal: MealCreate):
    db_meal = Meal(
        id=uuid.uuid4(),
        user_id=meal.user_id,
        date=meal.date,
        meal_type=meal.meal_type,
        recipe_id=meal.recipe_id
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal


def get_meal_plan(db: Session, meal_plan_id: str):
    return db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()


def get_meal(db: Session, meal_id: str):
    return db.query(Meal).filter(Meal.id == meal_id).first()


def get_recipes(db: Session):
    return db.query(Recipe).all()


def get_meal_plans_by_user(db: Session, user_id: UUID):
    return (
        db.query(MealPlan)
        .filter(MealPlan.user_id == user_id)
        .order_by(MealPlan.start_date.desc())
        .all()
    )
