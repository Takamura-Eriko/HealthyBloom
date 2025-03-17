from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
from uuid import UUID

router = APIRouter(prefix="/meal_plans", tags=["Meal Plans"])

@router.post("/", response_model=schemas.MealPlanResponse)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    return crud.create_meal_plan(db, meal_plan)

@router.get("/{meal_plan_id}", response_model=schemas.MealPlanResponse)
def get_meal_plan(meal_plan_id: UUID, db: Session = Depends(get_db)):
    meal_plan = crud.get_meal_plan(db, meal_plan_id)
    if meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return meal_plan
