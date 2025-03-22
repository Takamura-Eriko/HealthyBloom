from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
from uuid import UUID

router = APIRouter(prefix="/meals", tags=["Meals"])

@router.post("/", response_model=schemas.MealResponse)
def create_meal(meal: schemas.MealCreate, db: Session = Depends(get_db)):
    return crud.create_meal(db, meal)

@router.get("/{meal_id}", response_model=schemas.MealResponse)
def get_meal(meal_id: UUID, db: Session = Depends(get_db)):
    meal = crud.get_meal(db, meal_id)
    if meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal
