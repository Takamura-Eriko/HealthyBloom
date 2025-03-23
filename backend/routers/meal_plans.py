from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
import crud, schemas, models
from database import get_db
from uuid import UUID
from datetime import date, timedelta
import random

router = APIRouter(prefix="/meal_plans", tags=["Meal Plans"])

# 食事プランを手動で作成
@router.post("/", response_model=schemas.MealPlanResponse)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    return crud.create_meal_plan(db, meal_plan)

# 特定のユーザーの食事プランを取得
@router.get("/{user_id}", response_model=schemas.MealPlanDetailResponse)
def get_meal_plan(user_id: UUID, db: Session = Depends(get_db)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.user_id == user_id).first()
    if meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    meals = db.query(models.Meal).filter(models.Meal.user_id == user_id).all()

    return schemas.MealPlanDetailResponse(
        id=meal_plan.id,
        user_id=user_id,
        start_date=meal_plan.start_date,
        end_date=meal_plan.end_date,
        created_at=meal_plan.created_at,
        meals=[
            schemas.MealResponse(
                id=meal.id,
                user_id=meal.user_id,
                date=meal.date,
                meal_type=meal.meal_type,
                recipe_id=meal.recipe_id,
                created_at=meal.created_at
            ) for meal in meals
        ]
    )

# 健診データをもとに1週間の食事プランを生成
@router.post("/generate", response_model=schemas.MealPlanResponse)
def generate_meal_plan(
    meal_request: schemas.MealPlanGenerate = Body(...),
    db: Session = Depends(get_db)
):
    """
    健診データに基づいて1週間の食事メニューを生成するAPI
    """
    user = db.query(models.User).filter(models.User.id == meal_request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 既存のレシピを取得
    recipes = db.query(models.Recipe).all()
    if not recipes:
        raise HTTPException(status_code=404, detail="No recipes found")

    # MealPlan 作成
    meal_plan = models.MealPlan(
        user_id=meal_request.user_id,
        start_date=meal_request.start_date,
        end_date=meal_request.end_date
    )
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)

    # 各日の食事をランダムに割り当て
    days = (meal_request.end_date - meal_request.start_date).days + 1
    for i in range(days):
        for meal_type in ["breakfast", "lunch", "dinner"]:
            meal = models.Meal(
                user_id=meal_request.user_id,
                date=meal_request.start_date + timedelta(days=i),
                meal_type=meal_type,
                recipe_id=random.choice(recipes).id
            )
            db.add(meal)

    db.commit()
    return meal_plan
